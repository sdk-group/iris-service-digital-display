'use strict'

class AbstractDisplay {
	constructor() {

	}
	static getCommand(params) {
		throw new Error("It. Is. Abstract.");
	}
}


module.exports = AbstractDisplay;
