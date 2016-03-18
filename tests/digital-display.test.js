'use strict'

let DigitalDisplay = require("./DigitalDisplay/digital-display");
let config = require("./config/db_config.json");

describe("DigitalDisplay service", () => {
	let service = null;
	let bucket = null;
	before(() => {
		service = new DigitalDisplay();
		service.init();
	});
	describe("DigitalDisplay service", () => {
		it("should mark ticket called", (done) => {
			return service.actionTicketCalled()
				.then((res) => {
					console.log(res);
					done();
				})
				.catch((err) => {
					done(err);
				});
		})
	})

});