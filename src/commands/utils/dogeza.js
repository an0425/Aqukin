/* This module displays randomly one of the Aqua dogeza pictures */
const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class DogezaCommand extends BaseCommand{
    constructor() {super("dogeza", ["d"], "Display randomly one of Minato Aqua dogeza pictures", "SEND_MESSAGES", "utility", false, "", "-- will display a dogeza picture")}

    async run(para) {
        const { author, channel } = para.message;
        const { embedColour, dogeza } = para.bot.media;
        const embed = new MessageEmbed()
            .setColor(embedColour[Math.floor(Math.random() * Math.floor(embedColour.length))])
            .setTitle(`Oose no mama ni, **${author.username}**-sama`)
            .setImage(dogeza[Math.floor(Math.random() * Math.floor(dogeza.length))])
            .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
        channel.send(embed);
    } // end of run
}; // end of module.exports