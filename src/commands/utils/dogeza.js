/* This module fetches and displays randomly one of the two Aqua dogeza pictures */
const { MessageAttachment } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");
const attachments = [new MessageAttachment("src/pictures/dogeza_1.jpg"), new MessageAttachment("src/pictures/dogeza_2.jpg"), new MessageAttachment("src/pictures/dogeza_3.jpg")];

module.exports = class DogezaCommand extends BaseCommand{
    constructor() {super("dogeza", [], "Display randomly one of the two Aqua dogeza pictures", "SEND_MESSAGES", "utility", false, false, "")}

    run(para) {
        const {channel, author} = para.message;
        channel.send(`Oose no mama ni (As you will), **${author.username}**-sama!`, attachments[Math.floor(Math.random() * Math.floor(attachments.length))]);
    } // end of run
}; // end of module.exports