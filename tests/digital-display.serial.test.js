'use strict'

let DigitalDisplay = require("./DigitalDisplay/digital-display");

var SerialPort = require("serialport")
	.SerialPort
let CommandFactory = require("./DigitalDisplay/Command/Factory");
// var serialPort = require("serialport");
// serialPort.list(function (err, ports) {
// 	console.log();
// 	ports.forEach(function (port) {
// 		console.log(port.comName);
// 		console.log(port.pnpId);
// 		console.log(port.manufacturer);
// 	});
// });

describe.only("DigitalDisplay service to serial", () => {
	let service = null;
	let bucket = null;
	before(() => {
		service = new DigitalDisplay();
		service.init();
	});
	describe("DigitalDisplay service serial", () => {
		it("s...", (done) => {
			let cmd = CommandFactory.getCommand('Akis', {
				address: '8723',
				command: 'display',
				data: '666',
				flash: false,
				bit_depth: 6
			});
			let port = new SerialPort('COM3', {
				baudRate: 19200,
				dataBits: 8,
				parity: 'none',
				stopBits: 1
			});
			port.on('data', function (data) {
				console.log("DATA", data);
			});
			port.on('open', function (data) {
				console.log("OPENED", data);
			});

			port.on('error', function (err) {
				console.log("ERR", err);
				done(err);
			});

			port.open(function (err) {
				console.log("SENDING");
				port.write(cmd,
					function (res) {
						console.log("RESPONSE", res);
						done();
					});
				port.close();
			});
		});
	})

});
