/* This module displays randomly one of Aqua baquafina pictures */
const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class BaquafinaCommand extends BaseCommand{
    constructor() {super("baquafina", ["bqf", "bakafina", "baqukinfina"], "Baqua command but with a little bit more spices. Most effective when thristy.", "SEND_MESSAGES", "utility", false, "", "-- will display randomly a kinda *yabai* artwork of a Hololive member")}

    async run(para) {
        const embed = new MessageEmbed()
            .setColor(0x1DE2FE)
            .setTitle("Atashi~ PURE (* ¯︶¯ *)")
            .setImage(para.bot.media.baquafina[Math.floor(Math.random() * Math.floor(para.bot.media.baquafina.length))])
            .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
        para.message.channel.send(embed);
    } // end of run
}; // end of module.exports