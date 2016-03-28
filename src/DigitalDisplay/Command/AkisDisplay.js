'use strict'

let AbstractDisplay = require("./AbstractDisplay");

let chartable = {
	"0": 0x0,
	"1": 0x1,
	"2": 0x2,
	"3": 0x3,
	"4": 0x4,
	"5": 0x5,
	"6": 0x6,
	"7": 0x7,
	"8": 0x8,
	"9": 0x9,
	"A": 0xA,
	"b": 0xB,
	"C": 0xC,
	"d": 0xD,
	"-": 0xE,
	" ": 0xF
};

function toHex(char) {
	return _.isUndefined(chartable[char]) ? chartable[" "] : chartable[char];
}
class AkisDisplay extends AbstractDisplay {
	static getCommand(params) {
		let defaults = {
			address: '1',
			command: 'display',
			data: '------',
			time_on: 140,
			time_off: 130,
			brightness: 255,
			flash: false,
			symbol_depth: 6
		};
		let opt = _.merge(defaults, params);
		switch (opt.command) {
		case 'brightness':
			return this.brightnessCmd(opt.address, opt.brightness, opt.time_on, opt.time_off);
			break;
		case 'clear':
			return this.clearCmd();
			break;
		case 'refresh':
			return this.refreshCmd();
			break;
		case 'display':
		default:
			return this.displayCmd(opt.address, opt.data, opt.symbol_depth, opt.flash);
			break;
		}
	}


	static displayCmd(address, data, symbol_depth, flash) {
		let bd = _.clamp(symbol_depth, 0, 6);
		let msg = new Buffer(9);

		msg[0] = 0x08;
		this.setAddress(address, msg);
		msg[3] = 0x47;

		let num_buff = msg.slice(4, 7);
		let nums = _.chunk(_.padEnd(_(data)
				.takeRight(bd)
				.join(''), bd, ' '),
			2);
		_.map(nums, (num_pair, i) => {
			num_buff[i] = 0xFF & (toHex(num_pair[0]) << 4) | toHex(num_pair[1]);
		});

		msg[7] = flash ? 0x3F : 0x40;

		this.setCRC(msg);

		// console.log("MSG DISPLAY", msg);
		return msg;
	}

	static brightnessCmd(address, brightness, time_on, time_off) {
		let msg = new Buffer(8);

		msg[0] = 0x07;
		this.setAddress(address, msg);
		msg[3] = 0x48;

		msg.writeUInt8(_.clamp(_.parseInt(brightness), 0, 255), 4);
		msg.writeUInt8(_.clamp(_.parseInt(time_on), 0, 255), 5);
		msg.writeUInt8(_.clamp(_.parseInt(time_off), 0, 255), 6);

		this.setCRC(msg);

		console.log("MSG BRIGHTNESS", msg);
		return msg;
	}

	static setCRC(msg) {
		let last = msg.length - 1;
		msg[last] = _.reduce(msg.slice(0, last), (acc, byte) => {
			return acc ^ byte;
		}, 0x00);
	}

	static setAddress(address, msg) {
		let addr = msg.slice(1, 3);;
		addr.writeUInt16LE(_.parseInt(address));
	}

	static refreshCmd() {
		return new Buffer('03FFFF03', 'hex');
	}

	static clearCmd() {
		return new Buffer('03FFFE02', 'hex');
	}
}


module.exports = AkisDisplay;
