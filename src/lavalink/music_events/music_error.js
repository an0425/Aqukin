/* this module represents the "trackError" event for erela.js, emitted when there's an error with the track not being able to play */
const BaseEvent = require('../../utilities/structures/BaseEvent');

module.exports = class MusicErrorEvent extends BaseEvent {
constructor () {super("trackError");}

    async run (bot, player, track, payload) {
        console.log(payload);
        if(player.queue.size === 0) {
            player.destroy();
        }
        else{
            await player.queue.add(player.queue[0],1);
            await player.stop(); 
        }
        await bot.channels.cache.get(player.textChannel).send(`**${track.requester.username}**-sama, \`${track.title}\` was stuck, ${bot.user.username} will try to play it again 〜 (＞ ＜) 〜	`);
    } // end of run
} // end of module.exports