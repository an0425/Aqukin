/* This module allows the author to enqueue Youtube URL/Playlist/Tracks from search results to Aqukin audio streaming */
const { Utils } = require("erela.js");
const { MessageEmbed } = require("discord.js");
const {musicEmbed} = require("../../utilities/music_embed");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class PlayCommand extends BaseCommand{
    constructor() {super("play", ["p"], "Enqueue Youtube URL/Playlist/Tracks from search results", "CONNECT", "music", true, false, "<Youtube URL> or <Keywords>")}

    async run (para){
        // shortcut variables
        const {bot, message} = para;
        const author = message.author.username;
        let player = para.player;
        
        // spawns a player inside the author's voice channel if there's isn't any
        if(!player){
            const { channel } = message.member.voice
            player = bot.music.players.spawn({
                guild: message.guild,
                voiceChannel: channel,
                textChannel: message.channel,
            });
        } // end of if there's not exist an player
        
        // search for track(s) with the given arguments
        const query = para.args.join(" ");
        console.log(query);
        const searchResults = await bot.music
            .search(query, message.author)
            .catch((err) => {console.log(err)});
        
        // checks if there any search result(s), if not return a message to inform the author
        if(!searchResults) return message.channel.send(`**${author}**-sama, Aqukin can't find any tracks with the given keywords, please also note that Aqukin will not queue Youtube Audio Mix or Stream`, para.ridingAqua);;

        switch(searchResults.loadType){
            // a case for single link song
            case "TRACK_LOADED":
                player.queue.add(searchResults.tracks[0]); // enque
                message.channel.send(`**${author}**-sama, Aqukin has enqueued track **${searchResults.tracks[0].title}**`); // inform the author
                break;
                    
            // a case for search results
            case "SEARCH_RESULT":
                let i = 0;
                const tracks = searchResults.tracks.slice(0, 10);
                const tracksInfo = tracks.map(r => `${++i}) ${r.title}\n${r.uri} | length \`${Utils.formatTime(r.duration, true)}s\``).join("\n\n"); // get the tracks info
                // embed the result(s)
                const embed = new MessageEmbed()
                    .setColor(0x1DE2FE)
                    .setTitle("Automatically times out in 12 seconds")
                    .setDescription(tracksInfo)
                    .setImage("https://media1.tenor.com/images/85e6b8577e925a9037d03a796588e7ed/tenor.gif?itemid=15925240")
                    .setFooter("Vive La Résistance le Hololive~");
  
                const sentMessage = await message.channel.send(`**${author}**-sama, please enter the track number that you would like Aqukin to queue.`, embed); // display the embed
                try{ sentMessage.delete({ timeout: 12000 }); } catch(err) {console.log(err);} // delete the embed after 12s

                // Allow the author to select a track fron the search results within the allowed time of 12s
                const filter = m => (message.author.id === m.author.id) && (m.content >= 1 && m.content <= tracks.length);
                try{
                    let response = await message.channel.awaitMessages(filter, { max: 1, time: 12000, errors: ["time"]}) // await the user respond within 12s
                    const entry = response.first().content;
                    player = bot.music.players.get(message.guild.id);
                    await player.queue.add(tracks[entry-1]); // enqueue
                    response.first().delete(); // delete the user respond
                    message.channel.send(`**${author}**-sama, Aqukin has enqueued track **${tracks[entry-1].title}**`); // inform the author
                } catch(err) { return console.log(err)}
                break;
                    
            // a case for playlist
            case "PLAYLIST_LOADED":
                searchResults.playlist.tracks.forEach(track => player.queue.add(track));
                const duration = Utils.formatTime(searchResults.playlist.tracks.reduce((acc, cur) => ({duration: acc.duration + cur.duration})).duration, true);
                message.channel.send(`**${author}**-sama, Aqukin has enqueued \`${searchResults.playlist.tracks.length}\` tracks from the playlist \`${searchResults.playlist.info.name}\`| total length \`${duration}s\``);
                break;
        } // end of switch
        if (!player.playing && !player.paused) player.play(); // start playing if the player 

        if(player.sentMessage){
            // Update the currently playing embed
            const embed = await musicEmbed(para.bot.music, player, player.queue[0])
            try{
                await player.sentMessage.edit(embed); // send the embed to inform about the now playing track
            } catch(err) {
                console.log("Recreating the deleted music embed", err);
                player.sentMessage = await player.textChannel.send(embed);
            }
        }
    } // end of run
}; // end of module.exports
    
