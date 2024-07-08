const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (exceptions = []) => {
    let localCommands = [];
    const commandCategories = getAllFiles(path.join(__dirname, '..', 'commands'), true);

    for(const commandCategory of commandCategories) {
        const commandFiles = getAllFiles(commandCategory);

        for(const commandFile of commandFiles) {
            const commandObject = require(commandFile);
            if(exceptions.includes(commandObject.name)) continue;
            localCommands.push(commandObject);

            if(commandObject.options) {
                for(const option of commandObject.options) {
                    if(option.type === 'SUB_COMMAND' || option.type === 'SUB_COMMAND_GROUP') {
                        const subCommands = option.options;

                        for(const subCommand of subCommands) {
                            localCommands.push(subCommand);
                        }
                    }
                }
            }
        }
    }

    return localCommands;
}