/* This module allows the author to enqueue Youtube URL/Playlist/Tracks from search results to the bot audio streaming */
const BaseCommand = require("../../utilities/structures/BaseCommand");
const { BaseOpus } = require("../../utilities/structures/BaseMusic");


module.exports = class PlayCommand extends BaseCommand{
    constructor() {
        super("play", ["p"], "Enqueue Youtube Video/Playlist/Track from given URL search results", "CONNECT", "music", true, "<Youtube URL/Keywords>", "https://www.youtube.com/watch?v=6bnaBnd4kyU -- will enqueue the song \`#Aqua Iro Palette - Minato Aqua\`");
    }

    async run (para){
        // shortcut variables
        const { bot, message, voiceChannel } = para;
        const { author, channel } = message;

        // create a player if the player for this guild does not exist
        let player = await para.player || new BaseOpus(message.guild.id, channel);

        // search for track(s) with the given arguments
        const query = para.args.join(" ");
        const initQueue = player.queue.length;
        //console.log(query);

        await player.queue.push(...await player.getTracks(bot, query, channel, author, para.ridingAqua));

        if(!player.connection && player.queue.length > 0) {
            await player.initPlayer(voiceChannel, bot, author.username);
            await bot.music.set(message.guild.id, player); 

            await player.playing(bot, player).catch (err => {
                console.log(err);
                channel.send(`**${author.username}**-sama, \`${err}\``);   
                bot.music.delete(message.guild.id);
            }); 
        }

        // update the currently playing embed if it exists
        if(player.sentMessage && player.queue.length > initQueue){
            player.updateEmbed(bot);
        }
    } // end of run
}; // end of module.exports

