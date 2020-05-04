/* This module embeds the mentioned user into an embed then display it */
const Discord = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class InfoCommand extends BaseCommand{
    constructor() {super("info", ["user", "userinfo", "ui"], "Provide info about the tagged user", "SEND_MESSAGES", "ultility", true, "<mentioned user>")}
    
    run(para) {
        const user = para.message.mentions.users.first(); // get the mentioned user
        const member = para.message.guild.member(user); // get the mention user via the guild member list
        var memberRoles = member.roles.cache.map(role => role.name).join("\n") // get the mention user role(s) in the guild
        if (member) { // if they are in the server
            const embed = new Discord.MessageEmbed()
                .setColor(0x1DE2FE)
                .setTitle(`This is ${member.displayName}-sama information`)
                .addFields({name: "Username", value: member.user.username, inline: true},
                           {name: "Nickname", value: member.nickname, inline: true},
                           {name: "Role(s)", value: memberRoles})
                .setImage(member.user.displayAvatarURL())
            para.message.channel.send(embed)
        } else { para.message.channel.send(`${para.message.author.user}-sama, it looks like the person you mentioned isn't in this guild~`, para.ridingAqua);} // else they are not in the server
    } // end of run
}; // end of module.exports