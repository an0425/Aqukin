/* this module represents the "trackStart" event for erela.js, emitted when a track starts */
const { musicEmbed } = require("../utilities/embed_constructor");
const BaseEvent = require('../utilities/structures/BaseEvent');

module.exports = class TrackStartEvent extends BaseEvent {
    constructor () {super("trackStart");}

    async run (bot, player, track, payload) {
        player.pause(false);
        // construct the embed
        const embed = await musicEmbed(bot, player, track);
        player.sentMessage = await player.textChannel.send(embed).catch(err => console.log("an error has occurered trying to send the embed", err));    
    } // end of run
} // end of module.exports