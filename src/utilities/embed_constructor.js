/* This module construct an embed neccessary for displaying the current playing track */
const { convertTF } = require("../utilities/functions");
const { MessageEmbed } = require("discord.js");

async function musicEmbed(bot, player, track){
    const { thumbnails } = bot;
    const pauseStatus = await convertTF(player.connection.dispatcher.paused);
    //const loopStatus = await convertTF(player.trackRepeat);
    //const qloopStatus = await convertTF(player.queueRepeat);    
    // construct the embeds
    const embed = new MessageEmbed()
        .setColor(0x1DE2FE)
        .setThumbnail(thumbnails[Math.floor(Math.random() * Math.floor(thumbnails.length))])
        .setTitle("⬇️ Currently Playing ⬇️")
        .addFields({ name: "Title", value: `[${track.title}](${track.url})` },
                   { name: "Volume", value: `${player.connection.dispatcher.volume}`, inline: true },
                   { name: "Track Length", value: track.duration, inline: true },
                   { name: "Queue Size", value: `${player.queue.length}`, inline: true },
                   { name: "Paused", value: `${pauseStatus}`, inline: true },
                   //{ name: "Track Looped", value: `${loopStatus}`, inline: true },
                   //{ name: "Queue Looped", value: `${qloopStatus}`, inline: true },
                   { name: "Requested by", value: `**${track.requester.username}**-sama`, inline: true })
        .setImage(`https://img.youtube.com/vi/${track.id}/0.jpg`)
        .setFooter("Vive La Résistance le Hololive~");
    return embed;
} // end of musicEmbed(...)

async function marketEmbed(bot, message, stocks){
    const user = bot.currency.get(message.author.id);
    let description = "";
    stocks.forEach(stock => description += `\nThe **${stock.name}**\n\`Current stock price\` -- $${stock.cost}\n\`Available share(s)\` -- ${stock.market_share}\n`);

    // construct the embed
    const {thumbnails} = bot.music;
    const embed = new MessageEmbed()
        .setColor(0x1DE2FE)
        .setThumbnail(thumbnails[Math.floor(Math.random() * Math.floor(thumbnails.length))])
        .setTitle(`${message.guild.name} Stock Market`)
        .addFields({ name: "Your Balance", value: `$${bot.currency.getBalance(message.author.id)}`, inline: true },
                   { name: "Economy Role", value: `${user.econrole}`, inline: true },
                   { name: "Market", value: `${description}` },)
        .setImage("https://media1.tenor.com/images/4e30c640c8df3035dec6f99e5c31f52c/tenor.gif?itemid=17136673")
        .setFooter("Vive La Résistance le Hololive~");
    return embed;
} // end of marketEmbed(...)

module.exports = { marketEmbed, musicEmbed };