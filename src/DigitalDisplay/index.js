'use strict'

let events = {
	digital_display: {}
};

let tasks = [];


module.exports = {
	module: require('./digital-display.js'),
	permissions: [],
	exposed: true,
	tasks: tasks,
	events: {
		group: 'digital-display',
		shorthands: events.digital_display
	}
};
