/* This module cleans up a specified number of messages (max 99) */
const {MessageAttachment} = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class CleanCommand extends BaseCommand{
    constructor() {super("clean", ["delete", "del"], "Clean up a specified number of messages (max 99, requires Administrative permission)", "ADMINISTRATOR", "ultility", true, "<an integer less than or equals to 99>")}
    
    async run(para){
        const author = para.message.author.username; // message's author username
        const channel = para.message.channel; // para.message.channel for short
        // checks if the input is a valid number or not
        if (isNaN(para.args[0])) return channel.send(`${author}-sama, that's not a valid number~`, para.ridingAqua);
        // checks if the input is more than 99
        if(parseInt(para.args[0])>99) return channel.send(`${author}-sama, Aqukin can only delete a maximum of 99 messages only~`, para.ridingAqua);
        // interaction
        const attachment = new MessageAttachment("./src/pictures/melon.gif");
        const sentMessage = await channel.send(`Cleaning ${para.args[0]} messages`, attachment);
        await sentMessage.delete({ timeout: 3000 });
        // actual deletion
        channel.bulkDelete(parseInt(para.args[0])+1)
    } // end of run
}; // end of module.exports

