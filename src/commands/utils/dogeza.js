/* This module fetches and displays randomly one of the two Aqua dogeza pictures */
const { MessageAttachment } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");
const attachments = [new MessageAttachment("src/pictures/dogeza_1.jpg"), new MessageAttachment("src/pictures/dogeza_2.jpg")];

module.exports = class DogezaCommand extends BaseCommand{
    constructor() {super("dogeza", [], "Display randomly one of the two Aqua dogeza pictures", "SEND_MESSAGES", "ultility", false, false, "")}

    run(para) {
        para.message.channel.send("Oose no mama ni! (As you will, sir!)", attachments[Math.floor(Math.random() * Math.floor(attachments.length))]);
    } // end of run
}; // end of module.exports