const wifi = require("Wifi"); // https://www.espruino.com/ESP8266_WifiUsage
const port = 80;

const input = {
	forward: 5,
	back: 0,
	right: 16,
	left: 4,
	light: 2,
	horn: 14
};
//const pwm = {freq: 50, soft: true};

var timer;

const socketserver = require('ws').createServer((req, res) => { // https://www.espruino.com/ws#websocket-server
	wifi.getIP((err, data) => {
		console.log("Connect to http://" + data.ip + ":" + port);
	});
	const urlparts = url.parse(req.url, true);
	if (urlparts.pathname == "/") {
		res.writeHead(200);
		res.end(Storage.read("index"));
	} else if (urlparts.pathname == "/script.js") {
		res.writeHead(200);
		res.end(Storage.read("script"));
	}
}).listen(port);

socketserver.on("websocket", (ws) => {
	ws.on('message', (data) => { // When we receive a message
		analogWrite(input.left, data.left);
		analogWrite(input.right, data.right);
		analogWrite(input.forward, data.forward);
		analogWrite(input.back, data.back);
		analogWrite(input.horn, data.horn);
		digitalWrite(input.light, data.light);
		clearTimeout(timer); // Clear our old timeout
		timer = setTimeout(() => { // Create a new Dead man's switch timeout
			analogWrite(input.left, 0);
			analogWrite(input.right, 0);
			analogWrite(input.forward, 0);
			analogWrite(input.back, 0);
			digitalWrite(input.light, 1);
			analogWrite(input.horn, 0);
			}, 500);
	});
});
