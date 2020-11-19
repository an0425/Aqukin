/* This module displays randomly one of Aqua baquafina pictures */
const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class BaquafinaCommand extends BaseCommand{
    constructor() {super("baquafina", ["bf", "bakafina", "baqukinfina"], "Baqua command but with a little bit more spices. Most effective when thristy.", "SEND_MESSAGES", "utility", false, "", "-- will display randomly a kinda *yabai* artwork of a Hololive member")}

    async run(para) {
        const { embedColour, baquafina } = para.bot.media;
        const embed = new MessageEmbed()
            .setColor(embedColour[Math.floor(Math.random() * Math.floor(embedColour.length))])
            .setTitle("Atashi~ PURE (* ¯︶¯ *)")
            .setImage(baquafina[Math.floor(Math.random() * Math.floor(baquafina.length))])
            .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
        para.message.channel.send(embed);
    } // end of run
}; // end of module.exports