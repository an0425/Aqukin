/* This module searches and sends an attachment base on the given keyword */
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "send",
    aliases: ["search"],
    tag: "ultility",
    permission: "SEND_MESSAGES",
    args: false,
    usage: "<URL>",

    execute(para) {
        const author = para.message.author.username; // message's author username
        const channel = para.message.channel; // para.message.channel for short

        const attachment = new MessageAttachment("https://external-preview.redd.it/SglFSnWQU3ihr0s3ANQMtsPbETyHNQX0wJeZrKt7WAc.jpg?auto=webp&s=c96bf123a5e8a2b9bf1bd22b0cc5a7374ed3820a");
        channel.send(attachment);
    },
};