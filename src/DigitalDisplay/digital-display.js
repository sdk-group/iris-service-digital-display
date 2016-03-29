'use strict'

let emitter = require("global-queue");
let ServiceApi = require('resource-management-framework')
	.ServiceApi;
let CommandFactory = require("./Command/Factory");


class DigitalDisplay {
	constructor() {
		this.emitter = emitter;
	}

	init(cfg) {
		this.iris = new ServiceApi();
		this.iris.initContent();
	}

	launch() {
			this.emitter.on('digital-display.emit.command', ({
				org_addr,
				org_merged,
				workstation,
				command_data = {},
				command = 'display'
			}) => {
				let cmd = CommandFactory.getCommand(org_merged.digital_display_options.type, _.merge({
					address: workstation.digital_display_address,
					command
				}, command_data, org_merged.digital_display_options));

				let data = {
					command: cmd
				};
				let to_join = ['digital-display.command', org_addr];
				console.log("DD EMITTING", _.join(to_join, "."), cmd);
				this.emitter.emit('broadcast', {
					event: _.join(to_join, "."),
					data
				});
			});
			return Promise.resolve(true);
		}
		//API

}

module.exports = DigitalDisplay;
