/* This module cleans up a specified number of messages (max 99) */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class CleanCommand extends BaseCommand{
    constructor() {super("cleantext", ["del", "clean", "delete"], "Clean up a specified number of messages (max 99, requires Administrative rights)", "ADMINISTRATOR", "utility", true, false, "<a positive integer greater than 1 and less than or equals to 99>")}
    
    async run(para){
        const {message, ridingAqua} = para;
        const {author, channel} = message;
        const num = Math.floor(para.args[0]);

        // checks if the input is a valid number or not
        if (isNaN(num)) return channel.send(`**${author.username}**-sama, that's not a valid number~`, ridingAqua);
        // checks if the input is more than 99
        if(num>99) return channel.send(`**${author.username}**-sama, Aqukin can only delete a maximum of \`99\` messages only~`, ridingAqua);
        // else checks if the input is less than 1
        if(num<1) return channel.send(`**${author.username}**-sama, Aqukin can't clean a negative number of messages~`, ridingAqua);
        // interaction
        const sentMessage = await channel.send(`Cleaning \`${num}\` messages`, {files: ["https://media1.tenor.com/images/25d8ea73a241cce87c7aad65acd78ed7/tenor.gif?itemid=17267164"]});
        await sentMessage.delete({ timeout: 3000 });
        // actual deletion
        channel.bulkDelete(num+1)
    } // end of run
}; // end of module.exports

