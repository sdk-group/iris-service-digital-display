'use strict'

let AbstractDisplay = require("./AbstractDisplay");
let matrices = require("./svetovodmatrix.json");

class SvetovodMatrixDisplay extends AbstractDisplay {
	static getCommand(params) {
		let defaults = {
			address: '1',
			command: 'display',
			data: '----',
			bit_depth: 4,
			height: 9,
			width: 24,
			x_offset: 0,
			y_offset: 0,
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
			return this.displayCmd(opt.address, opt.data, opt.bit_depth, opt.height, opt.width, opt.x_offset, opt.y_offset, opt.flash);
			break;
		}
	}


	static displayCmd(address, data, bit_depth, height, width, x_offset, y_offset, flash) {
		let bd = _.clamp(bit_depth, 0, 4);
		let len = height * width / 8;
		let msg = new Buffer(len + 10 + 1);

		msg[0] = msg[1] = 0x00;
		msg[2] = 0xE0;
		this.setAddress(address, msg);
		//setting command 3 bytes
		msg.writeUIntBE(len, 5, 3);
		this.setHeaderCRC(msg);

		let num_buff = msg.slice(10, len + 10);
		let nums = _.padEnd(_(data)
			.takeRight(bd)
			.join(''), bd, ' ');
		this.setData(num_buff, nums, height, width, x_offset, y_offset);

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
			return acc + byte;
		}, 0x00);
	}

	static setHeaderCRC(msg) {
		let cmd_crc = _.reduce(msg.slice(0, 8), (acc, byte) => {
			return acc + byte;
		}, 0x0000);
		msg[9] = cmd_crc & 0xFF;
		msg[10] = (cmd_crc >> 8) + msg[9];
	}

	static setAddress(address, msg) {
		msg[3] = 0x00;
		msg.writeUInt8(_.parseInt(address), 4);
	}

	static setData(num_buff, nums, height, width, x_offset, y_offset) {
			let mx = matrices[`${width}x${height}`];
			num_buff.fill(0);
			let l_zeros = new RegExp("^(0*).*");
			let r_zeros = new RegExp(".*?(0*)$");
			_.map(nums, (num) => {
					let num_data = mx.font[num] || mx.font[" "];
					num_data = new Buffer(_.join(_.split(num_data, ' '), ''), 'hex');
					let symbol_width = num_data.length / height;
					let left_offset;
					let rigt_offset;
					_(num_data)
						.chunk(symbol_width)
						.map((val) => {
							let row = _(val)
								.map(v => v.toString(2))
								.join('');
							let l_min = _.min(_.size(row.match(l_zeros)[1]))
							left_offset = (left_offset < l_min) ? left_offset : l_min;
							let r_min = _.min(_.size(row.match(r_zeros)[1]))
							right_offset = (right_offset < r_min) ? right_offset : r_min;
							for (var i = 0; i < height; i++) {}

						});
				}

				static refreshCmd() {
					return new Buffer('03FFFF03', 'hex');
				}

				static clearCmd() {
					return new Buffer('03FFFE02', 'hex');
				}
			}


			module.exports = SvetovodMatrixDisplay;
