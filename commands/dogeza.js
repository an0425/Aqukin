/* This module fetches and displays randomly one of the two Aqua dogeza pictures */
const { MessageAttachment } = require("discord.js");
const attachments = [new MessageAttachment("pictures/dogeza_1.jpg"), new MessageAttachment("pictures/dogeza_2.jpg")];

module.exports = {
    name: "dogeza",
    aliases: [],
    tag: "ultility",
    permission: "SEND_MESSAGES",
    args: false,
    usage: "",

    execute(para) {
        const i = Math.floor(Math.random() * Math.floor(attachments.length));
        para.message.channel.send("Oose no mama ni! (As you will, sir!)", attachments[i]);
    },
};