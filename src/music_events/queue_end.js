/* this module represents the "queueEnd" event for erela.js, emitted when the queue ends */
const { MessageAttachment } = require("discord.js");
const BaseEvent = require('../utilities/structures/BaseEvent');

module.exports = class QueueEnd extends BaseEvent {
    constructor () {super("queueEnd");}

    async run (bot, player) {
        // interaction
        try {
        await player.destroy();
        player.textChannel.send("The queue has ended, arigatou gozaimatshita ☆ ⌒ ヽ (* '､ ^ *) chu~", { files: ["https://media1.tenor.com/images/2acd2355ad05655cb2a536f44660fd23/tenor.gif?itemid=17267169"] })
            .then(msg => msg.delete({ timeout: 5200 }));
    } catch (err) { console.log(err); }
  } // end of run
} // end of module.exports