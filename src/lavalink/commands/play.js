/* This module allows the author to enqueue Youtube URL/Playlist/Tracks from search results to Aqukin audio streaming */
const { MessageEmbed } = require("discord.js");
const { formatLength } = require("../../utilities/functions");
const { musicEmbed } = require("../../utilities/embed_constructor");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class PlayCommand extends BaseCommand{
    constructor() {
        super("play", ["p"], "Enqueue Youtube Video/Playlist/Track from given URL search results", "CONNECT", "music", true, "<Youtube URL/Keywords>", "https://www.youtube.com/watch?v=-aB6MQU8l1s -- will enqueue the song");
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
                
        // a case for single link song
        if(searchResults.loadType === "TRACK_LOADED"){
            await player.queue.add(searchResults.tracks[0]); // enque
            await message.channel.send(`**${author.username}**-sama, ${bot.user.username} has enqueued track \`${searchResults.tracks[0].title}\``); // inform the author
        }

        // a case for playlist
        else if(searchResults.loadType === "PLAYLIST_LOADED") {
            await searchResults.tracks.forEach(track => player.queue.add(track));
            message.channel.send(`**${author.username}**-sama, Aqukin has enqueued \`${searchResults.tracks.length}\` tracks from the playlist \`${searchResults.playlist.name}\`| total length \`${formatLength(searchResults.playlist.duration)}\``);
        }

        else if(searchResults.loadType === "SEARCH_RESULT") {
            let i = 0;
                const tracks = await searchResults.tracks.slice(0, 7);
                const tracksInfo = await tracks.map(r => `${++i}) [${r.title}](${r.uri}) | length \`${formatLength(r.duration, false, bot.music.lavalink)}\``).join("\n\n"); // get the tracks info
                // embed the result(s)
                const embed = new MessageEmbed()
                    .setColor(0x1DE2FE)
                    .setTitle("Automatically times out in 24 seconds")
                    .setDescription(tracksInfo)
                    .setImage("https://media1.tenor.com/images/85e6b8577e925a9037d03a796588e7ed/tenor.gif?itemid=15925240")
                    .setFooter("Vive La Résistance le Hololive~");
  
                /* Allow the author to select a track fron the search results within the allowed time of 24s */
                await message.channel.send(`**${author.username}**-sama, please enter the \`track number\` that you would like ${bot.user.username} to queue.`, embed)
                    .then(async (msg) => {
                        const filter = m => (message.author.id === m.author.id) && (m.content >= 1 && m.content <= tracks.length);
                        // await the user respond within 24s
                        await message.channel.awaitMessages(filter, { max: 1, time: 24000 }) 
                            .then(async (response) => {
                                const entry = await response.first().content;
                                await player.queue.add(tracks[entry-1]); // enqueue
                                await response.first().delete(); // delete the user respond
                                await message.channel.send(`**${author.username}**-sama, ${bot.user.username} has enqueued track \`${tracks[entry-1].title}\``); // inform the author
                            }).catch(err => console.log(err));

                        await msg.delete();
                    }).catch(err => console.log(err));
        }

        else{
            return message.channel.send(`**${author.username}**-sama, ${bot.user.username} can't find any tracks with the given keywords, please also note that Aqukin will not queue Youtube Audio Mix or Stream`, para.ridingAqua); 
        }

        if (!player.playing && !player.paused && !player.queue.size)
            player.play();

        // For playlists you'll have to use slightly different if statement
        else if (!player.playing && !player.paused && player.queue.totalSize === searchResults.tracks.length)
            player.play();

        if(player.sentMessage){
            // Update the currently playing embed
            const embed = await musicEmbed(bot, player, player.queue.current)
            await player.sentMessage.edit(embed) // send the embed to inform about the now playing track
                .catch(async err => { player.sentMessage = await bot.channels.cache.get(player.textChannel).send(embed); });
        }
    } // end of run
}; // end of module.exports