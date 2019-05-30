function onInit() { // https://www.espruino.com/Saving
	const socketserver = require('ws').createServer(function(req, res) { // https://www.espruino.com/ws#websocket-server
		const urlparts = url.parse(req.url, true);
		if (urlparts.pathname == "/" || urlparts.pathname == "/index.html") {
			res.writeHead(200);
			res.end(Storage.read("index"));
		} else if (urlparts.pathname == "/script.js") {
			res.writeHead(200);
			res.end(Storage.read("script"));
		}	
	}).listen(port);

	var time;
	socketserver.on("websocket", function(ws) {
		var time;
		setInterval(function() {
			time = Date.now();
			ws.send("ping");
		}, 911);
		ws.on('message', function(data) {
			if (data == "ping") {
				ws.send("pong");
			} else {
				console.log(Date.now() - time);
			}
		});
	});
}

