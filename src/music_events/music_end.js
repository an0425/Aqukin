/* this module represents the "trackEnd" event for erela.js, emitted when a track stops */
const BaseEvent = require('../utilities/structures/BaseEvent');

module.exports = class TrackEndEvent extends BaseEvent {
    constructor () {super("trackEnd");}
    async run (bot, player, track) {
        // reset the variables
        await player.sentMessage.delete().catch(err => console.log(err));
        await bot.votingSystem.delete(player.guild);
    } // end of run
} // end of module.exports