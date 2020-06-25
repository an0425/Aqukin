/* This module toggles the bot's ability to react */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ToggleReactionCommand extends BaseCommand{
    constructor() {super("togglereaction", ["tr", "reaction"], "Toggle enabling/disabling the reaction module", "ADMINISTRATOR", "settings", false, "", "-- will enable/disable Aqukin's ability to react")}
    
    async run(para){
        // shortcut variables
        const { message, bot } = para;

        bot.settings.enablereaction = !bot.settings.enablereaction;

        let reply = "";
        if(!bot.settings.reaction){ reply += `${bot.user.username} has disabled the reaction module (* ￣ ▽ ￣) b`; }
        else{ reply += `${bot.user.username} will now enable the reaction module (ﾉ ◕ ヮ ◕) ﾉ *: ･ ﾟ ✧`; }
        message.channel.send(`**${message.author.username}**-sama, ${reply}`);
    } // end of run
}; // end of module.exports

