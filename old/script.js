document.addEventListener('DOMContentLoaded', () => {
	const connection = document.getElementById("connection");
	const speed = document.getElementById("speed");
	const turn = document.getElementById("turn");
	var ws;
	if (location.host) {
		ws = new WebSocket("ws://" + location.host, "protocolOne");
	}

	setInterval(function() {
		const gp = Object.values(navigator.getGamepads()).find(gp => gp && gp.mapping == "standard");
		if (gp) {
			connection.classList.remove("bg-orange-100", "border-orange-500", "text-orange-700");
			connection.classList.add("bg-green-100", "border-green-500", "text-green-700");
			connection.getElementsByTagName('p')[0].innerHTML = "Gamepad found";
			connection.getElementsByTagName('p')[1].innerHTML = gp.id;
			const data = {
				left: 0,
				right: 0,
				forward: 0,
				back: 0
			};
			const currentSpeed = gp.buttons[7].value - gp.buttons[6].value;
			const currentTurn = gp.axes[0];
			if (currentSpeed > 0) {
				data.forward = currentSpeed;
			} else if (currentSpeed < 0) {
				data.back = - currentSpeed;
			}
			if (currentTurn > 0.1) { // Dead zone
				data.right = currentTurn;
			} else if (currentTurn < -0.1) {
				data.left = - currentTurn;
			}
			speed.setAttribute('data-value', currentSpeed * 100);
			turn.setAttribute('data-value', currentTurn * 30);
			if (ws && ws.readyState == 1) {
				ws.send(JSON.stringify(data));
			}
		} else {
			connection.classList.remove("bg-green-100", "border-green-500", "text-green-700");
			connection.classList.add("bg-orange-100", "border-orange-500", "text-orange-700");
			connection.getElementsByTagName('p')[0].innerHTML = "No gamepad found";
			connection.getElementsByTagName('p')[1].innerHTML = "Please ensure a gamepad is connected, and then <strong>press any button on the gamepad</strong> to enable discovery";
		}
	}, 100);
});