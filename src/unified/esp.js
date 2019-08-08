const wifi = require("Wifi");
const ws = require('ws');

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

const index = `<html>
<head>
	<title>RC Car</title>
	<script src="https://cdn.jsdelivr.net/npm/vue"></script>
	<script src="https://unpkg.com/canvas-gauges/gauge.min.js"></script>
	<link href="https://unpkg.com/tailwindcss/dist/tailwind.min.css" rel="stylesheet">
	<script src="script.js"></script>
</head>
<body>
	<div id="app">
		<div id="connection" :class="['bg-' + alert.colour + '-100', 'border-' + alert.colour + '-500', 'text-' + alert.colour + '-700', 'border-l-4', 'p-4', 'm-5']">
			<p class="font-bold">{{alert.title}}</p>
			<p>{{alert.message}}</p>
		</div>
		<canvas ref="speed"
			:data-value="speed * 100"
			data-type="radial-gauge"
			data-min-value="-20"
			data-max-value="100"
			data-animation-duration="0"
			data-value-box="false"
			data-width="300"
			data-height="300"
			data-units="Speed (%)"
			data-major-ticks="[-20,0,20,40,60,80,100]">
		</canvas>
		<canvas ref="turn"
			:data-value="turn * 30"
			data-type="linear-gauge"
			data-width="400"
			data-height="150"
			data-min-value="-30"
			data-max-value="30"
			data-major-ticks="-30,-20,-10,0,10,20,30"
			data-minor-ticks="5"
			data-animation-duration="0"
			data-bar-begin-circle="false">
		</canvas>
	</div>
</body>
</html>`;

const script = `document.addEventListener('DOMContentLoaded', () => {
	const websocket = (location.host ? new WebSocket("ws://" + location.host, "protocolOne") : null);
	const app = new Vue({
		el: '#app',
		data: {
			gamepad: null,
			light: 0,
		},
		computed: {
			alert: function() {
				if (this.gamepad) {
					return {
						colour: "green",
						title: "Gamepad found",
						message: this.gamepad.id
					};
				} else {
					return {
						colour: "orange",
						title: "Gamepad not found",
						message: "Please ensure a gamepad is connected, and then press any button on the gamepad to enable discovery"
					};
				}
			},
			speed: function() {
				return (this.gamepad ? this.gamepad.buttons[7].value - this.gamepad.buttons[6].value : 0);
			},
			turn: function() {
				return (this.gamepad ? this.gamepad.axes[0] : 0);
			},
		},
		watch: {
			gamepad: function(gamepad, oldgamepad) {
				if (websocket && websocket.readyState == 1) {
					if (gamepad && oldgamepad && gamepad.buttons[0].value && !oldgamepad.buttons[0].value) this.light = !this.light;
					const data = {
						forward: (this.speed > 0 ? this.speed : 0),
						back: (this.speed < -0 ? -this.speed : 0),
						right: (this.turn > 0.1 ? this.turn : 0),
						left: (this.turn < -0.1 ? -this.turn : 0),
						light: (this.light),
						horn: (gamepad && gamepad.buttons[1].value ? 0.5 : 0),
					};
					websocket.send(JSON.stringify(data));
				}
			},
		},
		mounted: function() {
			setInterval(() => {
				this.gamepad = Object.values(navigator.getGamepads()).find(gamepad => gamepad && gamepad.mapping == "standard");
			}, 100);
		}
	});
});`;

const socketserver = ws.createServer((req, res) => { // https://www.espruino.com/ws#websocket-server
	wifi.getIP((err, data) => { // https://www.espruino.com/ESP8266_WifiUsage
		console.log("Connect to http://" + data.ip + ":" + port);
	});
	const urlparts = url.parse(req.url, true);
	if (urlparts.pathname == "/") {
		res.writeHead(200);
		res.end(index);
	} else if (urlparts.pathname == "/script.js") {
		res.writeHead(200);
		res.end(script);
	}
}).listen(port);

socketserver.on("websocket", (ws) => {
	var timer;
	ws.on('message', (data) => { // When we receive a message, send our new instructions to the car
		console.log(typeof data);
		data = JSON.parse(data);
		analogWrite(input.left, data.left);
		analogWrite(input.right, data.right);
		analogWrite(input.forward, data.forward);
		analogWrite(input.back, data.back);
		analogWrite(input.horn, data.horn);
		digitalWrite(input.light, data.light);
		console.log(data.left, data.right, data.forward, data.back, data.horn, data.light);
		if (timer) clearTimeout(timer); // Clear our old timeout
		timer = setTimeout(() => { // Create a new timeout (Dead man's switch) to turn off the car after 500ms if there's no signal
			analogWrite(input.left, 0);
			analogWrite(input.right, 0);
			analogWrite(input.forward, 0);
			analogWrite(input.back, 0);
			digitalWrite(input.light, 1);
			analogWrite(input.horn, 0);
			}, 500);
	});
});
