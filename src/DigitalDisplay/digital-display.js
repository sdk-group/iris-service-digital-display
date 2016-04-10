'use strict'


let ServiceApi = require('resource-management-framework')
	.ServiceApi;
let CommandFactory = require("./Command/Factory");


class DigitalDisplay {
	constructor() {
		this.emitter = message_bus;
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
				this.emitter.addTask('workstation', {
						_action: 'get-workstations-cache',
						device_type: 'digital-display',
						organization: org_merged.id
					})
					.then((res) => {
						res = res['digital-display'];
						let keys = _(res)
							.filter(v => (v.attached_to == org_merged.id && !_(v.maintains)
								.keys()
								.intersection(_.castArray(workstation))
								.isEmpty()))
							.map('id')
							.value();

						return this.emitter.addTask('workstation', {
								_action: 'by-id',
								workstation: keys
							})
							.then((res) => {
								return Promise.map(_.values(res), (dd) => {
									let cmd = CommandFactory.getCommand(dd.display_type, _.merge({
										address: dd.maintains[workstation],
										command
									}, command_data, dd));

									let data = {
										command,
										data: cmd.toString('hex')
									};

									let to_join = ['digital-display.command', org_addr, dd.id];
									// console.log("ADDR", to_join);
									this.emitter.emit('broadcast', {
										event: _.join(to_join, "."),
										data
									});

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
