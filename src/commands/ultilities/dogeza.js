/* This module fetches and displays randomly one of the two Aqua dogeza pictures */
const { MessageAttachment } = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");
const attachments = [new MessageAttachment("src/pictures/dogeza_1.jpg"), new MessageAttachment("src/pictures/dogeza_2.jpg")];

module.exports = class DogezaCommand extends BaseCommand{
    constructor() {super("dogeza",[], "SEND_MESSAGES", "ultility", false, false, "")}

    run(para) {
        const i = Math.floor(Math.random() * Math.floor(attachments.length));
        para.message.channel.send("Oose no mama ni! (As you will, sir!)", attachments[i]);
    } // end of run
}; // end of module.exports