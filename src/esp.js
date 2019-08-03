const storage = require("Storage");
const wifi = require("Wifi");
const ws = require('ws');

const port = 80;

const input = {
	forward: 5,
	back: 16,
	right: 0,
	left: 4,
	light: 2,
	horn: 14
};
//const pwm = {freq: 50, soft: true};

function onInit() {
	const socketserver = ws.createServer((req, res) => { // https://www.espruino.com/ws#websocket-server
		wifi.getIP((err, data) => { // https://www.espruino.com/ESP8266_WifiUsage
			console.log("Connect to http://" + data.ip + ":" + port);
		});
		const urlparts = url.parse(req.url, true);
		if (urlparts.pathname == "/") {
			res.writeHead(200);
			res.end(storage.read("index"));
		} else if (urlparts.pathname == "/script.js") {
			res.writeHead(200);
			res.end(storage.read("script"));
		}
	}).listen(port);

	socketserver.on("websocket", (ws) => {
		var timer;
		ws.on('message', (data) => { // When we receive a message, send our new instructions to the car
			data = JSON.parse(data);
			if (data[0] != 'time') analogWrite(input[data[0]], data[1]);
			console.log(data);
			if (timer) clearTimeout(timer); // Clear our old timeout
			timer = setTimeout(() => { // Create a new timeout (Dead man's switch) to turn off the car after 500ms if there's no signal
				analogWrite(input.left, 0);
				analogWrite(input.right, 0);
				analogWrite(input.forward, 0);
				analogWrite(input.back, 0);
				analogWrite(input.light, 1);
				analogWrite(input.horn, 0);
				}, 500);
		});
	});
}