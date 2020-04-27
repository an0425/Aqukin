const {MessageAttachment} = require("discord.js");

/* This module cleans up a specified number of messages (max 99) */
module.exports = {
    name: "clean",
    aliases: ["delete"],
    tag: "ultility",
    permission: "ADMINISTRATOR",
    args: true,
    usage: "<integer less than or equals to 99>",
    
    async execute(para)
    {
        const author = para.message.author.username; // message's author username
        const channel = para.message.channel; // para.message.channel for short
        // checks if the input is a valid number or not
        if (isNaN(para.args[0])) return channel.send(`${author}-sama, that's not a valid number :(`);
        // checks if the input is more than 99
        if(parseInt(para.args[0])>99) return channel.send(`${author}-sama, Aqukin can only delete a maximum of 99 messages only :(`);
        // interaction
        const attachment = new MessageAttachment("pictures/clean.gif");
        const sentMessage = await channel.send(`Cleaning ${para.args[0]} messages`, attachment);
        await sentMessage.delete({ timeout: 5000 });
        // actual deletion
        channel.bulkDelete(parseInt(para.args[0])+1)
    },
};

