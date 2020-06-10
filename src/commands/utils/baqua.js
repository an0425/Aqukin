/* This module displays randomly one of the baqua pictures */
const { MessageAttachment } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");
const attachments = [new MessageAttachment("src/utilities/pictures/bakaqua_1.png"), new MessageAttachment("src/utilities/pictures/bakaqua_2.png")];

module.exports = class BaquaCommand extends BaseCommand{
    constructor() {super("baqua", ["baka", "tensai", "bakaqua"], "Display randomly one of the Baqua(?) pictures", "SEND_MESSAGES", "utility", false, "", "-- will display a Baqua(?) picture")}

    async run(para) {
        para.message.channel.send(`Atashi~ TENSAI (‾́ ◡ ‾́)`, attachments[Math.floor(Math.random() * Math.floor(attachments.length))]);
    } // end of run
}; // end of module.exports