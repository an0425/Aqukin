/* This module displays randomly one of the baqua pictures */
const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class BaquaCommand extends BaseCommand{
    constructor() {super("baqua", ["b", "baka", "baqukin"], "Display randomly one of the artworks of Hololive members", "SEND_MESSAGES", "utility", false, "", "-- will display a random artwork of a Hololive member")}

    async run(para) {
        const { embedColour } = para.bot.media;
        const embed = new MessageEmbed()
            .setColor(embedColour[Math.floor(Math.random() * Math.floor(embedColour.length))])
            .setTitle("Atashi~ TENSAI (‾́ ◡ ‾́)")
            .setImage(await para.bot.media.getMedia("baqua"))
            .setFooter("FREEDOM SMILE (^)o(^)b");
        para.message.channel.send(embed);
    } // end of run
}; // end of module.exports