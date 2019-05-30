document.addEventListener('DOMContentLoaded', () => {
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
});