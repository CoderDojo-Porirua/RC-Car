document.addEventListener('DOMContentLoaded', () => {
	const websocket = (location.host ? new WebSocket("ws://" + location.host, "protocolOne") : null);
	const app = new Vue({
		el: '#app',
		data: {
			gamepad: null,
		},
		computed: {
			alert: function() {
				if (this.gamepad) {
					return {
						colour: "green",
						title: "Gamepad found",
						message: this.gamepad.id
					}
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
			data: function() {
				return {
					right: (this.turn > 0.1 ? this.turn : 0),
					left: (this.turn < -0.1 ? -this.turn : 0),
					forward: (this.speed > 0 ? this.speed : 0),
					back: (this.speed < -0 ? -this.speed : 0),
				};
			},
		},
		watch: {
			data: function(data) {
				if (websocket && websocket.readyState == 1) {
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
});