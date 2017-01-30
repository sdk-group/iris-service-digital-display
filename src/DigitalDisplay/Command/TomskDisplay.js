'use strict'

let AbstractDisplay = require("./AbstractDisplay");
let Iconv = require('iconv')
	.Iconv;
var iconv = new Iconv('UTF-8', 'CP1251');
var crc16 = require('crc-16');

class TomskDisplay extends AbstractDisplay {
	static getCommand(params) {
		let defaults = {
			address: '1',
			command: 'display',
			data: '------',
			symbol_depth: 4
		};
		let opt = _.merge(defaults, params);
		switch (opt.command) {
		case 'clear':
			return this.displayCmd(opt.address, '', opt.symbol_depth);
			break;
		case 'refresh':
			return this.displayCmd(opt.address, _.padStart('', opt.symbol_depth, '-'), opt.symbol_depth);
			break;
		case 'display':
		default:
			return this.displayCmd(opt.address, opt.data, opt.symbol_depth);
			break;
		}
	}


	static displayCmd(address, data, symbol_depth) {
		console.log("###################DISPLAY########################", address, data);
		let msg = new Buffer(25);
		this.setAddress(address, msg);
		msg.writeUInt8(100, 1);
		msg.writeUInt8(20, 2);

		this.setMessage(msg, data, symbol_depth);
		this.setCRC(msg);

		console.log("MSG DISPLAY", msg, address, data, symbol_depth);
		return msg;
	}

	static setMessage(msg, data, symbol_depth) {
		let bd = _.clamp(symbol_depth, 0, 4);
		let num_buff = msg.slice(3, 23);
		_.fill(num_buff, ' ');
		let nums = _.padStart(_(data)
			.takeRight(bd)
			.join(''), bd, ' ');
		let cmd = "v11 set text=\"" + nums + "\"";
		console.log("NUMS", cmd);
		cmd = iconv.convert(cmd);
		console.log("NUMS", cmd);

		for (var i = 0; i < num_buff.length; i++) {
			num_buff[i] = cmd[i];
		}
	}

	static setCRC(msg) {
		let crc = Buffer.from(crc16(msg.slice(0, 23)));
		console.log("CRC", crc);
		msg.writeUInt8(crc[1], 23);
		msg.writeUInt8(crc[0], 24);
	}

	static setAddress(address, msg) {
		msg[0] = 0x00;
		msg.writeUInt8(_.parseInt(address), 0);
	}

}


module.exports = TomskDisplay;