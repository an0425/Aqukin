/* This module construct an embed neccessary for displaying the current playing track */
const { Utils } = require("erela.js");
const {MessageEmbed} = require("discord.js");

async function musicEmbed(music, player, track){
    const {thumbnails} = music;
    let pauseStatus = "No";
    let loopStatus = "No";
    let qloopStatus = "No";
    if(player.paused){
        let timestamp;
        try{
            timestamp = Utils.formatTime(player.position, true);
        } catch(err) {console.log(err);}

        if(timestamp){
            pauseStatus = `At ${timestamp}s`;
        }
        else{
            pauseStatus = `At <1s`;
        }
    }
    if(player.trackRepeat)  {loopStatus = "Yes"}
    if(player.queueRepeat)  {qloopStatus = "Yes"}
    
    // construct the embeds
    const embed = new MessageEmbed()
        .setColor(0x1DE2FE)
        .setThumbnail(thumbnails[Math.floor(Math.random() * Math.floor(thumbnails.length))])
        .setTitle("⬇️ Currently Playing ⬇️")
        .addFields({name: "Title", value: `[${track.title}](${track.uri})`},
                   {name: "Paused", value: `${pauseStatus}`, inline: true},
                   {name: "Track Looped", value: `${loopStatus}`, inline: true},
                   {name: "Queue Looped", value: `${qloopStatus}`, inline: true},
                   {name: "Length", value: `${Utils.formatTime(track.duration, true)}s`, inline: true},
                   {name: "Requested by", value: `**${track.requester.username}**-sama`, inline: true})
        .setImage(`https://img.youtube.com/vi/${track.identifier}/0.jpg`)
        .setFooter("Vive La Résistance le Hololive~");
    return embed;
} // end of musicEmbed(...)

module.exports = {musicEmbed};