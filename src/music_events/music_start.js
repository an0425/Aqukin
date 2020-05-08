/* this module represents the "trackStart" event for erela.js */
const { Utils } = require("erela.js");
const {MessageEmbed} = require("discord.js");
const BaseEvent = require('../utilities/structures/BaseEvent');

module.exports = class TrackStartEvent extends BaseEvent {
  constructor () {
    super("trackStart");
  }

  async run (music, player, track) {
    // reset the variables and set the EQ
    if (player.sentMessage) await player.sentMessage.delete().catch((err) => console.log("The message has already been manually deleted\n",err)); // try catch in case the message got deleted manually
    music.skipCount = 0;
    music.skippers.clear();
    player.setEQ([
      { band: 0, gain: 0.15 },
      { band: 1, gain: 0.15 },
      { band: 2, gain: 0.15 }
    ]);

    // construct the embed
    const embed = new MessageEmbed()
      .setColor(0x1DE2FE)
      .setThumbnail("https://media1.tenor.com/images/78de4f7e1aaf155aff81a77712af0719/tenor.gif?itemid=16796930")
      .setTitle("⬇️ Currently Playing ⬇️")
      .addFields({name: "Title", value: `[${track.title}](${track.uri})`},
                 {name: "Length", value: `${Utils.formatTime(track.duration, true)}`, inline: true},
                 {name: "Requested by", value: `**${track.requester.username}**-sama`, inline: true})
      .setFooter("Vive La Résistance le Hololive~");
    player.sentMessage = await player.textChannel.send(embed); // send the embed to inform about the now playing track
  } // end of run
} // end of module.exports