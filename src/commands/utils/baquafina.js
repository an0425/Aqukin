/* This module displays randomly one of Aqua baquafina pictures */
const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class BaquafinaCommand extends BaseCommand{
    constructor() {super("baquafina", ["bf", "bakafina", "baqukinfina"], "Baqua command but with a little bit more spices. Most effective when thristy.", "SEND_MESSAGES", "utility", false, "", "-- will display randomly a kinda *yabai* artwork of a Hololive member")}

    async run(para) {
        // check for nsfw channel
        const { channel, author } = para.message;
        if(!channel.nsfw){
            return channel.send(`**${author.username}**-sama, these images are \`nsfw\` ¬‿¬, please use it only in the appropriate channel`);
        }

        const { embedColour } = para.bot.media;
        const embed = new MessageEmbed()
            .setColor(embedColour[Math.floor(Math.random() * Math.floor(embedColour.length))])
            //.setTitle("Atashi~ PURE (* ¯︶¯ *)")
            .setImage(await para.bot.media.getMedia("baquafina"))
            .setFooter("FREEDOM SMILE (^)o(^)b");
        channel.send(embed);
    } // end of run
}; // end of module.exports