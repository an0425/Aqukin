/* This module displays randomly one of the baqua pictures */
const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class BaquaCommand extends BaseCommand{
    constructor() {super("baqua", ["bq", "baka", "baqukin"], "Display randomly one of the artworks of Hololive members", "SEND_MESSAGES", "utility", false, "", "-- will display a random artwork of a Hololive member")}

    async run(para) {
        const embed = new MessageEmbed()
            .setColor(0x1DE2FE)
            .setTitle("Atashi~ TENSAI (‾́ ◡ ‾́)")
            .setImage(para.bot.media.bakaqua[Math.floor(Math.random() * Math.floor(para.bot.media.bakaqua.length))])
            .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
        para.message.channel.send(embed);
    } // end of run
}; // end of module.exports