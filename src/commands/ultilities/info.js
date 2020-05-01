/* This module embeds the mentioned user into an embed then display it */
const Discord = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class InfoCommand extends BaseCommand{
    constructor() {super("info",[], "SEND_MESSAGES", "ultility", false, true, "<mentioned user>")}
    
    run(para) {
        const user = para.message.mentions.users.first(); // get the mentioned user
        const member = para.message.guild.member(user); // get the mention user via the guild member list
        if (member) { // if they are in the server
            const embed = new Discord.MessageEmbed()
                .setTitle(`This is ${member.displayName}-sama information`)
                .setColor(0x1DE2FE)
                .addField("Username ", member.user.username, true)
                .addField("Nickname ", member.nickname, true)
                .setImage(member.user.displayAvatarURL())
            para.message.channel.send(embed)
        } else { para.message.channel.send(`${para.message.author.user}-sama, it looks like the person you mentioned isn't in this server :(`);} // else they are not in the server
    } // end of run
}; // end of module.exports