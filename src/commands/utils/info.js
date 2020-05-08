/* This module embeds the mentioned user into an embed then display it */
require("dotenv").config();
const {MessageEmbed} = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class InfoCommand extends BaseCommand{
    constructor() {super("info", ["user", "userinfo", "ui"], "Provide info about the tagged user", "SEND_MESSAGES", "ultility", true, "<mentioned user>")}
    
    async run(para) {
        const user = para.message.mentions.users.first(); // get the mentioned user
        // checks if the author has mentioned anyone, if not return a message to inform the author
        if (!user) { return para.message.channel.send(`**${para.message.author.user}**-sama, it looks like you haven't mentioned anyone~, please ensure that you are using the right syntax`, para.ridingAqua);}
        
        // checks if the user has tagged Aqukin
        if(user.id === "702620458130079750"){
            const aquaCh = "https://www.youtube.com/channel/UC1opHUrw8rvnsadT-iGp7Cg";
            const creator = await para.bot.users.fetch("422435290054000640");
            const embed = new MessageEmbed()
                .setColor(0x1DE2FE)
                //.setThumbnail(`${user.displayAvatarURL()}`)
                .setThumbnail("https://media1.tenor.com/images/6ea2ecbe506ba7a51bc4a83bd5f16ae7/tenor.gif?itemid=17126194")
                .setTitle(`**${para.message.author.username}**-sama, this is my information`)
                .addFields({name: "Name", value: user.username, inline: true},
                           {name: "Version", value: `${process.env.VER}`, inline: true},
                           {name: "Role", value: "Dai Tenshi\nSeigi no Mikata\nNinja Combat Maid\nThe Leader of Hololive Resistance"},
                           {name: "Description", value: "I am a bot that was created based on a Virtual Youtuber known as **Minato Aqua**"},
                           {name: "Minato Aqua Channel", value: `[Aqua Ch. 湊あくあ](${aquaCh})`, inline: true},
                           {name: "Author", value: `**${creator.username}**-sama`, inline: true},
                           {name: "Date Created", value: user.createdAt.toLocaleDateString(), inline: true})
                .setImage("https://media1.tenor.com/images/8bb13d9fa4311f314a2d419c9d2d6c37/tenor.gif?itemid=16917426")
                .setFooter("Vive La Résistance le Hololive~");
            return para.message.channel.send(embed); // send the embed
        } // end of if the author has tagged Aqukin
        
        // if not continue with the code
        const member = para.message.guild.member(user); // get the mention user via the guild member list
        var memberRoles = member.roles.cache.map(role => role.name).join("\n") // get the mention user role(s) in the guild
        // checks if the member is in the guild, if not return a message to inform the author
        if (!member) { return para.message.channel.send(`**${para.message.author.user}**-sama, it looks like the person you mentioned isn't in this guild~`, para.ridingAqua);}
        
        var nickname;
        if(member.nickname) nickname = member.nickname; // checks if the user has a nickname
        else nickname = "None"; // if not display "None" instead of "null"
        const embed = new MessageEmbed()
            .setColor(0x1DE2FE)
            .setThumbnail("https://media1.tenor.com/images/cc14493a42cd23e7db5a45675089b87e/tenor.gif?itemid=17042819")
            .setTitle(`**${para.message.author.username}**-sama, this is **${member.displayName}**-sama information`)
            .addFields({name: "Nickname", value: nickname, inline: true},
                        {name: "Tag", value: member.user.tag},
                        {name: "Role(s)", value: memberRoles, inline: true},
                        {name: "Date Joined", value: member.joinedAt.toLocaleDateString(), inline: true})
            .setImage(member.user.displayAvatarURL({format: "png", dynamic: true, size: 2048}))
            .setFooter("Vive La Résistance le Hololive~");
        para.message.channel.send(embed)
        
    } // end of run
}; // end of module.exports