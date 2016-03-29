'use strict'

let AbstractDisplay = require("./AbstractDisplay");
let matrices = require("./svetovodmatrix.json");

class SvetovodMatrixDisplay extends AbstractDisplay {
	static getCommand(params) {
		let defaults = {
			address: '1',
			command: 'display',
			data: '----',
			symbol_depth: 4,
			height: 9,
			width: 24,
			x_offset: 0,
			y_offset: 0,
			symbol_interval: 1
		};
		let opt = _.merge(defaults, params);
		switch (opt.command) {
		case 'clear':
			return this.displayCmd(opt.address, '', opt.symbol_depth, opt.height, opt.width, opt.x_offset, opt.y_offset, opt.symbol_interval);
			break;
		case 'refresh':
			return this.displayCmd(opt.address, _.padStart('', opt.symbol_depth, '-'), opt.symbol_depth, opt.height, opt.width, opt.x_offset, opt.y_offset, opt.symbol_interval);
			break;
		case 'display':
		default:
			return this.displayCmd(opt.address, opt.data, opt.symbol_depth, opt.height, opt.width, opt.x_offset, opt.y_offset, opt.symbol_interval);
			break;
		}
	}


	static displayCmd(address, data, symbol_depth, height, width, x_offset, y_offset, symbol_interval) {
		let bd = _.clamp(symbol_depth, 0, 4);
		let len = height * width / 8;
		let msg = new Buffer(len + 10 + 1);
		msg.fill(0);
		// console.log("MSG DISPLAY -2", msg, len);

		msg[0] = msg[1] = 0x00;
		msg[2] = 0xE0;
		this.setAddress(address, msg);
		//setting command 3 bytes
		msg.writeUIntBE(len, 5, 3);
		// console.log("MSG DISPLAY -1", msg);
		this.setHeaderCRC(msg);
		// console.log("MSG DISPLAY 0", msg);

		let num_buff = msg.slice(10, len + 10);
		let nums = _.padEnd(_(data)
			.takeRight(bd)
			.join(''), bd, ' ');
		this.setData(num_buff, nums, height, width, x_offset, y_offset, symbol_interval);

		this.setCRC(msg);

		// console.log("MSG DISPLAY", msg);
		return msg;
	}

	static setCRC(msg) {
		let last = msg.length - 1;
		msg[last] = _.reduce(msg.slice(10, last), (acc, byte) => {
			return acc + byte;
		}, 0);
	}

	static setHeaderCRC(msg) {
		let cmd_crc = _.reduce(msg.slice(0, 8), (acc, byte) => {
			return acc + byte;
		}, 0);
		msg[9] = cmd_crc & 0xFF;
		msg[8] = (cmd_crc >> 8) + cmd_crc & 0xFF;
	}

	static setAddress(address, msg) {
		msg[3] = 0x00;
		msg.writeUInt8(_.parseInt(address), 4, true);
	}

	static setData(num_buff, nums, height, width, x_offset, y_offset, symbol_interval) {
		let mx = matrices[`${width}x${height}`];
		num_buff.fill(0);
		let r_zeros = new RegExp(".*?(0*)$");
		let l_zeros = new RegExp("^(0*).*");
		let rows = new Array(height);
		_.fill(rows, '');
		_.map(nums, (num, index) => {
			let num_data = mx.font[num] || mx.font[" "];
			num_data = new Buffer(_.join(_.split(num_data, ' '), ''), 'hex');
			let symbol_width = num_data.length / height; //bytes
			let symbol_length = symbol_width * 8; //bits
			let left_offset = symbol_length; //bits
			let right_offset = symbol_length; //bits
			// console.log("SYMW", symbol_width, height, width / 8, num_data, num);
			_(num_data)
				.chunk(symbol_width)
				.map(function (val) {
					let row = _(val)
						.map(v => _.padStart(v.toString(2), 8, '0'))
						.join('');
					row = _(row)
						.toArray()
						.join('');
					// console.log("ROW", row, val);
					let l_min = _.size(row.match(l_zeros)[1]);
					left_offset = (left_offset < l_min) ? left_offset : l_min;
					let r_min = _.size(row.match(r_zeros)[1]);
					right_offset = (right_offset < r_min) ? right_offset : r_min;
				})
				.value();
			for (var i = 0; i < height; i++) {
				let sym = num_data.readUIntBE(i * symbol_width, symbol_width) >>> right_offset;
				let fill = (left_offset == symbol_length && right_offset == symbol_length) ? symbol_length : (symbol_length + (!!index && symbol_interval) - left_offset - right_offset);
				rows[i] += _.padStart((sym)
					.toString(2), fill, '0');
			}
			let max = _.max(_.map(rows, r => _.size(r.toString(2))));
			// console.log("ROWS", require('util')
			// 	.inspect(_.map(rows, s => {
			// 		// s = _.padStart(s, max, "0");
			// 		return _(s)
			// 			.map(v => (v == '0' ? ' ' : '*'))
			// 			.join('')
			// 	}), {
			// 		depth: null
			// 	}));
		});

		for (var j = 0; j < height; j++) {
			let to_write = rows[j - y_offset] || _.padStart('', width, '0');
			//can be removed
			if (x_offset > 0) {
				to_write = _.padStart(to_write, x_offset + to_write.length, '0');
			}
			//necessary
			if (x_offset < 0) {
				to_write = to_write.substring(x_offset);
			}
			//necessary
			to_write = to_write.substring(0, width);
			console.log("I",
				_(to_write)
				.map(v => (v == '0' ? ' ' : '*'))
				.join(''), "I"
			);
			num_buff.writeUIntBE(_.parseInt(to_write, 2), j * width / 8, width / 8);
		}
	}
}


module.exports = SvetovodMatrixDisplay;
