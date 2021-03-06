/* This module cleans up a specified number of messages (max 99) */
const { checkNum } = require("../../utilities/functions");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class CleanMessageCommand extends BaseCommand{
    constructor() {super("cleanmessage", ["ct", "cm", "clean", "cleantext"], "Bulk delete a specified number of messages including the command call, default to the set number (10 by default) if left blank (maximum 99)", "ADMINISTRATOR", "utility", false, "[number]", "12 -- will bulk delete 13 messages **including 1 for the command call**")}
    
    async run(para){
        const { author, channel } = para.message;
        const defaultNum = await para.bot.settings.get(para.message.guild.id).default_msg_num;
        const num = await checkNum(para.args[0], defaultNum, 1, true);

        // checks if the input is more than 99
        if(num>99) { return channel.send(`**${author.username}**-sama, ${para.bot.user.username} can only delete a maximum of \`99\` messages only (｡ • ́︿ • ̀｡)`); }

        channel.bulkDelete(num+1).then(() => {
            channel.send(`Cleaned \`${num}\` messages`, {files: ["https://media1.tenor.com/images/f7b00948fa084c6de0e461ebfb12a90d/tenor.gif?itemid=17086199"]})
                .then( msg => msg.delete({ timeout: 3000 }) );
        }).catch(err => channel.send(`**${author.username}**-sama, \`${err}\``));
    } // end of run
}; // end of module.exports

