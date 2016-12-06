'use strict'

let AkisDisplay = require("./AkisDisplay");

class Cvt2Display extends AkisDisplay {
	static setAddress(address, msg) {
		let addr = msg.slice(1, 3);;
		addr.writeUInt16BE(_.parseInt(address));
	}
}


module.exports = Cvt2Display;