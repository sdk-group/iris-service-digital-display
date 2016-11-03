'use strict'

let events = {
	digital_display: {}
};

let tasks = [];


module.exports = {
	module: require('./digital-display.js'),
	name: 'digital-display',
	permissions: [],
	exposed: true,
	tasks: tasks,
	events: {
		group: 'digital-display',
		shorthands: events.digital_display
	}
};