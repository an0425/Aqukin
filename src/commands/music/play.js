/* This module allows the author to enqueue Youtube URL/Playlist/Tracks from search results to Aqukin audio streaming */
const { Utils } = require("erela.js");
const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class PlayCommand extends BaseCommand{
    constructor() {super("play", ["p"], "Enqueue Youtube URL/Playlist/Tracks from search results", "CONNECT", "music", true, "<Youtube URL> or <Keywords>")}

    async run (para){
        // shortcut variables
        const bot = para.bot;
        const msg = para.message;
        const author = para.message.author.username;
        let player = para.player;
        
        const query = para.args.join(" ");
        console.log(query);
        
        // spawns a player inside the author's voice channel if there's isn't any
        if(!player){
            const { channel } = msg.member.voice
            player = bot.music.players.spawn({
            guild: msg.guild,
            voiceChannel: channel,
            textChannel: msg.channel,
            paused: false
            });
        } // end of if
        
        try { // try and catch any errors
            // searches the results with the given keywords
            await bot.music.search(query, msg.author).then(async searchResults =>{
                switch(searchResults.loadType){
                    // a case for single link song
                    case "TRACK_LOADED":
                        player.queue.add(searchResults.tracks[0]); // enque
                        msg.channel.send(`**${author}**-sama, Aqukin has enqueued track **${searchResults.tracks[0].title}**`); // inform the author
                        break;
                    
                    // a case for search results
                    case "SEARCH_RESULT":
                        let i = 0;
                        const tracks = searchResults.tracks.slice(0, 10);
                        const tracksInfo = tracks.map(r => `${++i}) ${r.title}\n${r.uri} | length \`${Utils.formatTime(r.duration, true)}\``).join("\n\n"); // get the tracks info
                        // embed the result(s)
                        const embed = new MessageEmbed()
                            .setColor(0x1DE2FE)
                            .setAuthor(bot.user.tag, bot.user.displayAvatarURL())
                            .setDescription(tracksInfo)
                            .setImage("https://media1.tenor.com/images/85e6b8577e925a9037d03a796588e7ed/tenor.gif?itemid=15925240")
                            .setFooter("Vive La Résistance le Hololive~");
  
                        const sentMessage = await msg.channel.send(`**${author}**-sama, please enter the track number that you would like Aqukin to queue.`, embed); // display the embed
                        if(sentMessage) sentMessage.delete({ timeout: 12000 }); // delete the embed after 12s

                        // Allow the author to select a track fron the search results within the allowed time of 12s
                        const filter = m => (msg.author.id === m.author.id) && (m.content >= 1 && m.content <= tracks.length);
                        let response = await msg.channel // await the user respond within 12s
                            .awaitMessages(filter, { max: 1, time: 12000, errors: ["time"]});
            
                        // Checks if the author has provided an respond within 12s, if not return a message to inform them, if so delete the respond and continue on with the function
                        if (!response) return msg.channel.send(`**${author}**-sama, timed out, please queue again`, para.ridingAqua);
                        
                        const entry = response.first().content;
                        msg.channel.bulkDelete(1); // delete the user respond
                        player = bot.music.players.get(msg.guild.id);
                        player.queue.add(tracks[entry-1]); // enqueue
                        msg.channel.send(`**${author}**-sama, Aqukin has enqueued track **${tracks[entry-1].title}**`); // inform the author
                        break;
                    
                    // a case for playlist
                    case "PLAYLIST_LOADED":
                        searchResults.playlist.tracks.forEach(track => player.queue.add(track));
                        const duration = Utils.formatTime(searchResults.playlist.tracks.reduce((acc, cur) => ({duration: acc.duration + cur.duration})).duration, true);
                        msg.channel.send(`**${author}**-sama, Aqukin has enqueued \`${searchResults.playlist.tracks.length}\` tracks from the playlist \`${searchResults.playlist.info.name}\`| total length \`${duration}\``);
                        break;
                } // end of switch
            }) // end of bot.music.search(...) function 
            if (!player.playing && !player.paused) player.play(); // start playing if the player 
        } catch (err) {
            console.log(err); // log the error
            msg.channel.send(`**${author}**-sama, Aqukin can't find any tracks with the given keywords, please also note that Aqukin will not queue Youtube Audio Mix or Stream`, para.ridingAqua); // inform the user the about the error
        } // end of catch
    } // end of run
}; // end of module.exports
    
