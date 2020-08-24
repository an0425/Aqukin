/* This module let author to change the default number of messages to clean */
const { checkNum } = require("../../utilities/functions");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class DefaultMessageNumCommand extends BaseCommand{
    constructor() {super("defaultmessagenum", ["dmn", "messagenum"], "Configuring the default number of messages to clean when no or invalid argument is given to the clean text command (maximum 99)", "ADMINISTRATOR", "settings", false, "[number]", "12 -- will change the default number of messages to clean to 12", true)}
    
    async run(para){
        // shortcut variables
        const { message, bot, settings } = para;
        const num = await checkNum(para.args[0], 1, 1, true);

        if(num > 99){
            return message.channel.send(`**${message.author.username}**-sama, the maximum default number of messages ${bot.user.username} can clean is \`99\``);
        }
        
        settings.default_msg_num = num;
        await settings.save();

        message.channel.send(`**${message.author.username}**-sama, ${bot.user.username} has change the default number of messages to clean to \`${settings.default_msg_num}\``);
    } // end of run
}; // end of module.exports