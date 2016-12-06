'use strict'

let AkisDisplay = require("./AkisDisplay");

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

class Cvt2Display extends AkisDisplay {
	static setAddress(address, msg) {
		let addr = msg.slice(1, 3);;
		addr.writeUInt16BE(_.parseInt(address));
	}

	static setMessage(msg, data, symbol_depth) {
		let bd = _.clamp(symbol_depth, 0, 4);
		let num_buff = msg.slice(4, 7);
		let nums = _.chunk(_.padStart(_(data)
				.takeRight(bd)
				.join(''), bd, ' '),
			2);
		_.map(nums, (num_pair, i) => {
			num_buff[i] = 0xFF & (toHex(num_pair[0]) << 4) | toHex(num_pair[1]);
		});
	}

}


module.exports = Cvt2Display;