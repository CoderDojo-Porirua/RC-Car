const ssid = "honeychurch";
const password = "w1r3l3ss";
const port = 80;

const page = ```
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Title of the document</title>
		<!--<script src="/socket.io/socket.io.js"></script>-->
		<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
		<!--<script src="https://cdn.jsdelivr.net/npm/vue"></script>-->
		<script>
			var app = new Vue({
				el: '#app',
				data: {
					message: 'Hello Vue!'
				}
			});
			//var socket = io();
			const ws = new WebSocket("ws://" + location.host, "protocolOne");
			ws.onmessage = function(event) {
				app.message = event.data;
			}
			/*socket.on('data', function(msg) {
				app.message = msg;
			});*/
		</script>
	</head>
	<body>
		<div id="app">
			{{message}}
		</div>
	</body>
</html>
```;

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

function onInit() {
  // https://www.espruino.com/ws#websocket-server
  const socketserver = require('ws').createServer(function(req, res) {
    const urlparts = url.parse(req.url, true);
    if (urlparts.pathname=="/") {
      res.writeHead(200);
      res.end(page);
    } else if (urlparts.pathname=="/test") {
      res.writeHead(200);
      res.end("Goodbye, cruel world");
    }  
  }).listen(port);

  socketserver.on("websocket", function(ws) {
    ws.on('message', function(msg) {
      print("[WS] " + JSON.stringify(msg));
    });
    ws.send("Hello from Espruino!");
  });
}
