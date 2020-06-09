/* This module toggles Aqukin's ability to react */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ToggleReactionCommand extends BaseCommand{
    constructor() {super("togglereaction", ["tr", "reaction"], "Toggle enabling/disabling the reaction module", "ADMINISTRATOR", "settings", false, "", "-- will enable/disable Aqukin's ability to react")}
    
    async run(para){
        // shortcut variables
        const { message, bot } = para;

        bot.settings.enablereaction = !bot.settings.enablereaction;

        let reply = "";
        if(!bot.settings.reaction){ reply += "Aqukin has disabled the reaction module * ￣ ▽ ￣) b"; }
        else{ reply += "Aqukin will now enable the reaction module (ﾉ ◕ ヮ ◕) ﾉ *: ･ ﾟ ✧"; }
        message.channel.send(`**${message.author.username}**-sama, ${reply}`);
    } // end of run
}; // end of module.exports

