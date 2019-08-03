document.addEventListener('DOMContentLoaded', () => {
	const websocket = (location.host ? new WebSocket("ws://" + location.host, "protocolOne") : null);
	const app = new Vue({
		el: '#app',
		data: {
			gamepad: null,
			time: Date.now(),
			light: 0,
		},
		computed: {
			left: function() {
				return (this.gamepad < -0.1 ? - parseFloat(this.gamepad.axes[0].toFixed(2)) : 0);
			},
			right: function() {
				return (this.gamepad > 0.1 ? parseFloat(this.gamepad.axes[0].toFixed(2)) : 0);
			},
			forward: function() {
				return (this.gamepad ? parseFloat(this.gamepad.buttons[7].value.toFixed(2)) : 0);
			},
			back: function() {
				return (this.gamepad ? - parseFloat(this.gamepad.buttons[6].value.toFixed(2)) : 0);
			},
			horn: function() {
				return (gamepad && gamepad.buttons[1].value ? 0.5 : 0);
			},
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
		},
		watch: {
			gamepad: function(gamepad, oldgamepad) {
				if (gamepad && oldgamepad && gamepad.buttons[0].value && !oldgamepad.buttons[0].value) this.light = !this.light;
			},
			time: function(data) {
				this.send(['time', data]);
			},
			left: function(data) {
				this.send(['left', data]);
			},
			right: function() {
				this.send(['right', data]);
			},
			forward: function() {
				this.send(['forward', data]);
			},
			back: function() {
				this.send(['back', data]);
			},
			horn: function() {
				this.send(['horn', data]);
			},
			light: function() {
				this.send(['light', data]);
			},
		},
		methods: {
			send: function(data) {
				if (websocket && websocket.readyState == 1) {
					websocket.send(JSON.stringify(data));
				}
			}
		},
		mounted: function() {
			setInterval(() => {
				this.time = Date.now();
				this.gamepad = Object.values(navigator.getGamepads()).find(gamepad => gamepad && gamepad.mapping == "standard");
			}, 200);
		}
	});
});