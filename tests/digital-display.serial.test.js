'use strict'

let DigitalDisplay = require("./DigitalDisplay/digital-display");

var SerialPort = require("serialport")
	.SerialPort
let CommandFactory = require("./DigitalDisplay/Command/Factory");
// var serialPort = require("serialport");

describe("DigitalDisplay service to serial", () => {
	let service = null;
	let bucket = null;
	before(() => {
		service = new DigitalDisplay();
		service.init();
	});
	describe.only("DigitalDisplay service svetovod display", () => {
		it("s...", (done) => {
			let cmd = CommandFactory.getCommand('SvetovodMatrix', {
				address: '255',
				command: 'display',
				data: '1234',
				y_offset: 0,
				x_offset: 0,
				symbol_depth: 4,
				height: 9,
				width: 24,
			});
			console.log("CMD", cmd);
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
	describe("DigitalDisplay service akis display", () => {
		it("s...", (done) => {
			let cmd = CommandFactory.getCommand('Akis', {
				address: '8723',
				command: 'display',
				data: ' 42',
				flash: false,
				symbol_depth: 6
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
	describe("DigitalDisplay service akis brightness", () => {
		it("s...", (done) => {
			let cmd = CommandFactory.getCommand('Akis', {
				address: '8723',
				command: 'brightness',
				time_on: 31,
				time_off: 31,
				brightness: 255
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
