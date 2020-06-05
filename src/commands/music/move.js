/* This module allows the author to move into a specified timestamp in current track of Aqukin's audio stream  */
const BaseCommand = require("../../utilities/structures/BaseCommand");
const { convertInput, formatLength } = require("../../utilities/functions");

module.exports = class MoveCommand extends BaseCommand{
    constructor() {super("move", ["m", "to", "time"], "Move the audio player to a specified timestamp in the current track", "CONNECT", "music", true, false, "<hh:mm:ss>, example <1:32>")}
    
    async run(para){
        // shortcut variables
        const { message, player } = para;
        const author = message.author.username;
        const timestamp = await convertInput(para.args[0]);

        if(await convertInput(para.args[0]) >= player.queue[0].duration) { return await message.channel.send(`**${author}**-sama, the timestamp should be less than the track length \`${await formatLength(player.queue[0].duration)}\` (´-﹃-\`)`); }
        
        // try to move to the given timestamp, inform the author if fail
        try{
            player.seeking = true;
            await player.queue.splice(1, 0, player.queue[0]);
            player.queue[1].seek = timestamp;
            await player.connection.dispatcher.end();
            // inform the author if success
            await message.channel.send(`**${author}**-sama, Aqukin will now moving the current track to position \`${await formatLength(timestamp)}\`, please be patient _(ˇωˇ」∠)\\_`);
            const sentMgs = await message.channel.send({files: ["https://media1.tenor.com/images/bf16c156ab3e2301d22e6494fdab91c8/tenor.gif?itemid=17235518"]})
            sentMgs.delete({ timeout:5200 });
        } catch(err) {
            console.log(err);
            player.connection.moving = false;
            message.channel.send(`**${author}**-sama, please provide a valid timestamp (´-﹃-\`)`, para.ridingAqua);
        } 
    } // end of run
}; // end of module.exports 



    
