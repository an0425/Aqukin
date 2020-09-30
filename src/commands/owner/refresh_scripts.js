/* *PROTOTYPE NOT WORKING* This module allow the OWNER to refresh the commands and events lists without interupting the bot 
const { registerEvents, registerCommands } = require("../../utilities/handlers");
const { Collection } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class RefreshScriptsCommand extends BaseCommand{
    constructor() {super("refreshscripts", ["refresh"], "Refresh the commands and events lists without having to interupt the bot", "SEND_MESSAGES", "owner", false, "", "-- will refresh the commands and events lists", true)}
    
    async run(para){
        // shortcut variables
        const { message, bot } = para;
        
        //await registerEvents(bot, "../../events");
        bot.commands = new Collection();
        await registerCommands(bot, "../../src/commands");
        
        message.channel.send(`**${message.author.username}**-sama, ${bot.user.username} has refreshed the commands and events lists (o´ ▽ \`o)`);
    } // end of run
}; // end of module.exports */