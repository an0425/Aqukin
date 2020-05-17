/* this module represents the "trackStart" event for erela.js, emitted when a track starts */
const { Utils } = require("erela.js");
const {MessageEmbed} = require("discord.js");
const BaseEvent = require('../utilities/structures/BaseEvent');

module.exports = class TrackStartEvent extends BaseEvent {
  constructor () {super("trackStart");}

  async run (music, player, track) {
    // construct the embed
    const thumbnails = ["https://media1.tenor.com/images/5144c642df05176d7f20be7d291274b7/tenor.gif?itemid=15931764",
                        "https://media1.tenor.com/images/e33ef399a8d06046ad28c0641c3fa222/tenor.gif?itemid=17189888",
                        "https://media1.tenor.com/images/4b9213ff002bad456cfb61bac5c97825/tenor.gif?itemid=16773860",
                        "https://media1.tenor.com/images/97a1434f73da24d3eeb1d7a0ea7cb177/tenor.gif?itemid=16216257",
                        "https://media1.tenor.com/images/f67c5255f1abd4f6a30aa4fd80b0561d/tenor.gif?itemid=16216275",
                        "https://media1.tenor.com/images/78de4f7e1aaf155aff81a77712af0719/tenor.gif?itemid=16796930",
                        "https://media1.tenor.com/images/7f39df2061e5eafd91f4fc40064636f0/tenor.gif?itemid=17086138",
                        "https://media1.tenor.com/images/cf96cd968b6d71dc5d9c32ed7a20fab4/tenor.gif?itemid=17097490",
                        "https://media1.tenor.com/images/bd16983aeafcd0446662a267791ee55f/tenor.gif?itemid=16598932",
                        "https://media1.tenor.com/images/406ceaf8b409a4f3e1bacef2cd084592/tenor.gif?itemid=17045844",
                        "https://media1.tenor.com/images/b4765f9afdbbce895c60f504810ebe90/tenor.gif?itemid=16695128",
                        "https://media1.tenor.com/images/671328a90cbd2640ce0d2785289dcc5a/tenor.gif?itemid=16643620",
                        "https://media1.tenor.com/images/5c0aaa147cc768b7f0967616cf675bb2/tenor.gif?itemid=16652649",
                        "https://media1.tenor.com/images/16eadf034787f65e5bde3b469aa45f63/tenor.gif?itemid=16958536"]
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