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
				user_id,
				command_data = {},
				command = 'display'
			}) => {
				this.emitter.addTask('agent', {
						_action: 'active-agents',
						agent_type: 'SystemEntity'
					})
					.then((res) => {
						_.map(res, (user_id) => {
							let cmd = CommandFactory.getCommand(org_merged.digital_display_options.type, _.merge({
								address: workstation.digital_display_address,
								command
							}, command_data, org_merged.digital_display_options));

							let data = {
								command,
								data: cmd.toString('hex')
							};
							let to_join = ['digital-display.command', org_addr, user_id];
							console.log("DD EMITTING", user_id, _.join(to_join, "."), cmd);
							this.emitter.emit('broadcast', {
								event: _.join(to_join, "."),
								data
							});
						});
					});
			});

			return Promise.resolve(true);
		}
		//API
	actionBootstrap({
		workstation,
		user_id,
		user_type = "SystemEntity"
	}) {
		return Promise.props({
				workstation: this.emitter.addTask('workstation', {
						_action: 'occupy',
						user_id,
						user_type,
						workstation
					})
					.then((res) => {
						return res.workstation;
					})
			})
			.catch(err => {
				console.log("DD BTSTRP ERR", err.stack);
			});
	}

	actionReady({
		user_id,
		workstation
	}) {
		return Promise.resolve({
			success: true
		});
	}

}

module.exports = DigitalDisplay;
