/* This module allows the author to skip a track in Aqukin current audio streaming */
const BaseCommand = require("../../utilities/structures/BaseCommand");

let USED = false; // default the command recently used check to false

module.exports = class SkipCommand extends BaseCommand{
    constructor() {super("skip", ["s", "n", "nxt", "next"], "Skip the current track", "CONNECT", "music", false, true, "")}
    
    async run (para) {
        // shortcut variables
        const { message, player, voteReached } = para;
        if(!voteReached) { return; }

        player.connection.dispatcher.end();;
        message.channel.send(`**${message.author.username}**-sama, Aqukin has skipped track **${player.songs[0].title}**`);
    } // end of run
}; // end of module.exports




    
