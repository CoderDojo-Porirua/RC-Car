const ssid = "honeychurch";
const password = "w1r3l3ss";
const port = 80;

const page = `
<html>
	<head>
		<title>RC Car</title>
		<script>
			const ws = new WebSocket("ws://" + location.host, "protocolOne");
			var time;
			setInterval(function() {
				time = Date.now();
				ws.send("ping");
			}, 811);
			ws.onmessage = function({data}) {
				if (data == "ping") {
					ws.send("pong");
				} else {
					console.log(Date.now() - time);
					document.getElementById("message").innerHTML = Date.now() - time;
				}
			};
		</script>
	</head>
	<body>
		<div id="message">
			None
		</div>
	</body>
</html>
`;

// https://www.espruino.com/ESP8266_WifiUsage
const wifi = require("Wifi");
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
			console.log("Connect to http://" + data.ip + ":" + port);
		});
	});
	wifi.save();
});

// https://www.espruino.com/Saving
function onInit() {
	// https://www.espruino.com/ws#websocket-server
	const socketserver = require('ws').createServer(function(req, res) {
		const urlparts = url.parse(req.url, true);
		if (urlparts.pathname=="/") {
			res.writeHead(200);
			res.end(page);
		} else if (urlparts.pathname=="/test") {
			res.writeHead(200);
			res.end("Hello World!");
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
