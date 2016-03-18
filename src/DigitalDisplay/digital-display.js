'use strict'

let emitter = require("global-queue");
let ServiceApi = require('resource-management-framework')
	.ServiceApi;

class DigitalDisplay {
	constructor() {
		this.emitter = emitter;
	}

	init(cfg) {
		this.iris = new ServiceApi();
		this.iris.initContent();
	}

	launch() {
			return Promise.resolve(true);
		}
		//API

}

module.exports = DigitalDisplay;
