/* This module toggles Aqukin's ability to communicate */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ToggleCommunicationCommand extends BaseCommand{
    constructor() {super("togglecommunication", ["tc", "communication"], "Toggle enabling/disabling the communication module", "ADMINISTRATOR", "settings", false, "", "-- will enable/disable Aqukin's ability to communicate")}
    
    async run(para){
        // shortcut variables
        const { message, bot } = para;
        
        bot.settings.enablecommunication = !bot.settings.enablecommunication;

        let reply = "";
        if(!bot.settings.enablecommunication){ reply += "Aqukin has disabled the communication module (* ￣ ▽ ￣) b"; }
        else{ reply += "Aqukin will now enable the communication module (*´꒳`\\*)"; }
        message.channel.send(`**${message.author.username}**-sama, ${reply}`);
    } // end of run
}; // end of module.exports

