/* This module embeds the mentioned user into an embed then display it */
const Discord = require("discord.js")

module.exports = {
    name: "info",
    aliases: [],
    tag: "ultility",
    permission: "SEND_MESSAGES",
    args: true,
    usage: "<user>",
    
    execute(para) {
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
        } else { // else they are not in the server
            para.message.channel.send(`${para.message.author.user}-sama, it looks like the person you mentioned isn't in this server :(`);
        }
    },
};