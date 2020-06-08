/* This module changes Aqukin's current prefix */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ConfigurePrefixCommand extends BaseCommand{
    constructor() {super("configureprefix", ["cp", "changeprefix", "prefix"], "Configure the prefix", "ADMINISTRATOR", "settings", true, "<new prefix>", "?! -- will change Aqukin's current prefix to ?!")}
    
    async run(para){
        // shortcut variables
        const { message, bot } = para;
        
        bot.settings.prefix = para.args[0];
        message.channel.send(`**${message.author.username}**-sama, Aqukin has changed the current prefix to ${bot.settings.prefix} (*´꒳\`\\*)`);
    } // end of run
}; // end of module.exports

