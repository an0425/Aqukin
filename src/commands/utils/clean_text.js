/* This module cleans up a specified number of messages (max 99) */
const {MessageAttachment} = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class CleanCommand extends BaseCommand{
    constructor() {super("clean", ["delete", "del"], "Clean up a specified number of messages (max 99, requires Administrative permission)", "ADMINISTRATOR", "ultility", true, false, "<an integer less than or equals to 99>")}
    
    async run(para){
        const {message} = para;
        const {author, channel} = message;
        const num = Math.floor(para.args[0]);

        // checks if the input is a valid number or not
        if (isNaN(num)) return channel.send(`**${author.username}**-sama, that's not a valid number~`, para.ridingAqua);
        // checks if the input is more than 99
        if(num>99) return channel.send(`**${author.username}**-sama, Aqukin can only delete a maximum of \`99\` messages only~`, para.ridingAqua);
        // interaction
        const sentMessage = await channel.send(`Cleaning \`${num}\` messages`, new MessageAttachment("./src/pictures/melon.gif"));
        await sentMessage.delete({ timeout: 3000 });
        // actual deletion
        channel.bulkDelete(num+1)
    } // end of run
}; // end of module.exports

