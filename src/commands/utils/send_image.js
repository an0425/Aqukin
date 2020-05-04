/* This module searches and sends an attachment base on the given keyword */
const { MessageAttachment } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class SendCommand extends BaseCommand{
    constructor() {super("send", ["find", "search"], "Search google for a random image based on the given keywords (CURRENTLY NOT WORKING)", "SEND_MESSAGES", "ultility", false, "<URL> (CURRENTLY NOT WORKING)")}

    async run(para) {
        const author = para.message.author.username; // message's author username
        const channel = para.message.channel; // para.message.channel for short

        const attachment = new MessageAttachment("https://external-preview.redd.it/SglFSnWQU3ihr0s3ANQMtsPbETyHNQX0wJeZrKt7WAc.jpg?auto=webp&s=c96bf123a5e8a2b9bf1bd22b0cc5a7374ed3820a");
        channel.send(`**${author}**-sama, this command is still not ready to be used`, attachment);
    } // end of run
}; // end of module.exports