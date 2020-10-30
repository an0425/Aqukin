/* this module represents the "trackStuck" event for erela.js, emitted when there's an error with the track not being able to play */
const BaseEvent = require('../utilities/structures/BaseEvent');

module.exports = class MusicStuckEvent extends BaseEvent {
    constructor () {super("trackStuck");}

    async run (bot, player, track, payload) {
        console.log(payload);

        if(player.queue.size === 0) {
            player.destroy();
        }
        else{
            //await player.queue.add(player.queue[0],1);
            await player.stop(); 
        }
        await player.textChannel.send(`**${track.requester.username}**-sama, \`${payload}\` has occured when ${bot.user.username} was trying to play track \`${track.title}\` 。 ゜ ゜ (´Ｏ\`) ゜ ゜。`);
    } // end of run
} // end of module.exports