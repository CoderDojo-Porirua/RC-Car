const fs = require('fs');
const esp = require("espruino");
const util = require('util');

const port = "COM7";

const espRunScript = util.promisify(function(port, script, callback) {
	esp.expr(port, script, (response) => {
    callback(null, response);
	});
});

const espWriteFile = util.promisify(function(port, name, file, callback) {
	esp.expr(port, `require("Storage").write(${name}, \`${fs.readFileSync(file, 'utf8')}\`)`, (response) => {
    callback(null, response);
	});
}
);

esp.init(async () => {
	Espruino.Config.BAUD_RATE = "115200";
  Espruino.Config.WEB_BLUETOOTH = false;
	await espWriteFile(port, 'index', 'index.html');
	await espWriteFile(port, 'script', 'script.js');
	await espRunScript(port, fs.readFileSync('wifi.js', 'utf8'));
	console.log(await espRunScript(port, 'require("Storage").list()'));
	console.log("IP: ", await espRunScript(port, 'require("Wifi").getIP(function(err, data) {return data.ip;});'));
});
