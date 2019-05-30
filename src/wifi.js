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
	wifi.save();
});
