/* This module allows the author to enqueue Youtube URL/Playlist/Tracks from search results to Aqukin audio streaming */
const BaseCommand = require("../../utilities/structures/BaseCommand");
const { musicEmbed } = require("../../utilities/embed_constructor");
const { getTracksL } = require("../../utilities/structures/BaseMusic");

module.exports = class PlayCommand extends BaseCommand{
    constructor() {
        super("play", ["p"], "Enqueue Youtube Video/Playlist/Track from given URL search results", "CONNECT", "music", true, "<Youtube URL/Keywords>", "https://www.youtube.com/watch?v=6bnaBnd4kyU -- will enqueue the song \`#Aqua Iro Palette - Minato Aqua\`");
    }
    async run (para){
        // shortcut variables
        const { bot, message, voiceChannel } = para;
        const { author, channel } = message;

        // search for track(s) with the given arguments
        const query = para.args.join(" ");
        //console.log(query);
        const searchResults = await bot.music.search(query, message.author).catch((err) => { console.log(err)} );
        
        // create a player if the player for this guild does not exist
        let player = await para.player 
        
        if(!player){
            player = bot.music.create({
                guild: message.guild.id,
                voiceChannel: voiceChannel.id,
                textChannel: channel.id,
            });
            await player.connect();
        }

        await getTracksL(bot, searchResults, channel, author, para.ridingAqua).then(async results => {
            await results.forEach(track => { player.queue.add(track); });
        });

        if (!player.playing && !player.paused && !player.queue.size)
            player.play().catch(console.error);

        // For playlists you'll have to use slightly different if statement
        else if (!player.playing && !player.paused && player.queue.totalSize === searchResults.tracks.length)
            player.play().catch(console.error);

        if(player.sentMessage){
            // Update the currently playing embed
            const embed = await musicEmbed(bot, player, player.queue.current)
            await player.sentMessage.edit(embed) // send the embed to inform about the now playing track
                .catch(async err => { player.sentMessage = await bot.channels.cache.get(player.textChannel).send(embed); });
        }
    } // end of run
}; // end of module.exports