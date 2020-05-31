/* This module cleans up a specified number of messages (max 99) */
const { checkNum } = require("../../utilities/functions");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class CleanCommand extends BaseCommand{
    constructor() {super("cleantext", ["del", "clean", "delete"], "Clean up a specified number of messages (max 99, requires Administrative rights)", "ADMINISTRATOR", "utility", false, false, "[a positive integer less than or equals to 99]")}
    
    async run(para){
        const {message, ridingAqua} = para;
        const {author, channel} = message;
        const num = await checkNum(para.args[0], 10);

        // checks if the input is more than 99
        if(num>99) { return channel.send(`**${author.username}**-sama, Aqukin can only delete a maximum of \`99\` messages only~`, ridingAqua); }

        // interaction
        const sentMessage = await channel.send(`Cleaning \`${num}\` messages`, {files: ["https://media1.tenor.com/images/bf16c156ab3e2301d22e6494fdab91c8/tenor.gif?itemid=17235518"]});
        await sentMessage.delete({ timeout: 3000 });
        // actual deletion
        channel.bulkDelete(num+1)
    } // end of run
}; // end of module.exports

