function onInit() { // https://www.espruino.com/Saving
	const socketserver = require('ws').createServer(function(req, res) { // https://www.espruino.com/ws#websocket-server
		const urlparts = url.parse(req.url, true);
		if (urlparts.pathname == "/") {
			res.writeHead(200);
			res.end(Storage.read("index"));
		} else if (urlparts.pathname == "/script.js") {
			res.writeHead(200);
			res.end(Storage.read("script"));
		}
	}).listen(80);

	var timer;
	const pwm = {freq: 50, soft: true};
	socketserver.on("websocket", function(ws) {
		ws.on('message', function(data) {
			analogWrite(D1, data.left, pwm);
			analogWrite(D2, data.right, pwm);
			analogWrite(D3, data.forward, pwm);
			analogWrite(D4, data.back, pwm);
			clearTimeout(timer);
			timer = setTimeout(function() { // Dead man's switch
				analogWrite(D1, 0, pwm);
				analogWrite(D2, 0, pwm);
				analogWrite(D3, 0, pwm);
				analogWrite(D4, 0, pwm);
			}, 500);
		});
	});
}
