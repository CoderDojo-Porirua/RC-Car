// https://www.espruino.com/ESP8266_WifiUsage

const wifi = require("Wifi");
wifi.connect("honeychurch", {password: "w1r3l3ss"}, function(err) {
  if (err) {
    console.log("Connection error: ", err);
    return;
  }
  wifi.setHostname("RC-Car");
  //wifi.turbo(true);
	wifi.getIP(function(err, data) {
		console.log("IP Address: ", data.ip);
	});
  wifi.save();
});
