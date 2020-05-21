/* this module represents the "trackStart" event for erela.js, emitted when a track starts */
const { Utils } = require("erela.js");
const {MessageEmbed} = require("discord.js");
const BaseEvent = require('../utilities/structures/BaseEvent');

module.exports = class TrackStartEvent extends BaseEvent {
  constructor () {super("trackStart");}

  async run (music, player, track) {
    // construct the embed
    const {thumbnails} = music; 
    const embed = new MessageEmbed()
      .setColor(0x1DE2FE)
      .setThumbnail(thumbnails[Math.floor(Math.random() * Math.floor(thumbnails.length))])
      .setTitle("⬇️ Currently Playing ⬇️")
      .addFields({name: "Title", value: `[${track.title}](${track.uri})`},
                 {name: "Length", value: `${Utils.formatTime(track.duration, true)}`, inline: true},
                 {name: "Requested by", value: `**${track.requester.username}**-sama`, inline: true})
      .setImage(`https://img.youtube.com/vi/${track.identifier}/0.jpg`)
      .setFooter("Vive La Résistance le Hololive~");
    player.sentMessage = await player.textChannel.send(embed); // send the embed to inform about the now playing track
  } // end of run
} // end of module.exports