'use strict'

let discover = function (type) {
	let Model;
	try {
		Model = require(`./${_.upperFirst(_.camelCase(type))}Display.js`);
	} catch (e) {
		Model = false;
	} finally {
		return Model;
	}
}

class CommandFactory {
	constructor() {
		throw new Error("Don't you.");
	}

	static getCommand(type, params) {
		return discover(type)
			.getCommand(params);
	}
}


module.exports = CommandFactory;
