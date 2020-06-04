/* This module displays randomly one of the Aqua dogeza pictures */
const { MessageAttachment } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");
const attachments = [new MessageAttachment("src/utilities/pictures/dogeza_1.jpg"), new MessageAttachment("src/utilities/pictures/dogeza_2.jpg"), new MessageAttachment("src/utilities/pictures/dogeza_3.png")];

module.exports = class DogezaCommand extends BaseCommand{
    constructor() {super("dogeza", [], "Display randomly Aqua dogeza pictures", "SEND_MESSAGES", "utility", false, false, "")}

    async run(para) {
        const { channel, author } = para.message;
        channel.send(`Oose no mama ni (As you will), **${author.username}**-sama _(´ㅅ\`)⌒)\\_`, attachments[Math.floor(Math.random() * Math.floor(attachments.length))]);
    } // end of run
}; // end of module.exports