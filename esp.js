const ssid = "honeychurch";
const password = "w1r3l3ss";

const wifi = require("Wifi"); // https://www.espruino.com/ESP8266_WifiUsage
wifi.connect(ssid, {password: password}, function(err) {
	if (err) {
		console.log("Connection error:", err);
		return;
	}
	wifi.setHostname("RC-Car");
	//wifi.turbo(true);
	wifi.on('connected', function() {
		wifi.getIP(function(err, data) {
			//console.log("IP Address: ", data.ip);
			console.log("Connect to http://" + data.ip);
		});
	});
	wifi.save();
});

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
