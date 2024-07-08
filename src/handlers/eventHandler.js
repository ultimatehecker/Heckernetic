const path = require('path');
const fileSystem = require('fs');
const { Client, Discord } = require('discord.js');
const getAllFiles = require('../utilities/getAllFiles');

/**
 * 
 * @param {Client} Discord
 * @param {Discord} client
 */

module.exports = (Discord, client) => {
	const load_dir = (dirs) => {
		const event_files = fileSystem.readdirSync(`./src/events/${dirs}`).filter((file) => file.endsWith("js"));

		for (const file of event_files) {
			const event = require(`../events/${dirs}/${file}`);
			const event_name = file.split(".")[0];
			client.on(event_name, event.bind(null, Discord, client));
		}	
	};

	["client"].forEach((e) => load_dir(e));
};