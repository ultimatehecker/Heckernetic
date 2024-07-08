/*

const getAllFiles = require('../utilities/getAllFiles');
const commandHandler = require('./commandHandler');
const fileSystem = require('fs');

module.exports = (Discord, client) => {
    console.time("Finished Loading Context Menu Data in");

    const contextFiles = getAllFiles(path.join(__dirname, '..', 'context'), false).filter((file) => file.endsWith('.js'));
    for (const contextFile of contextFiles) {
        const context = require(`../contexts/${contextFile}`);
        if(context.name) {
            client.contextMenus.set(context.name, context)
            commandHandler.slashCommands.push({
                name: context.name,
                type: context.type
            });
        } else {
            continue;
        }
    }

    console.timeEnd("Finished Loading Context Menu Data in");
}

*/