/* This module allows the author to enqueue Youtube URL/Playlist/Tracks from search results to Aqukin audio streaming */
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const ytsr = require("ytsr");
const { MessageEmbed } = require("discord.js");
const { convertLenght } = require("../../utilities/functions");
// const { musicEmbed } = require("../../utilities/embed_constructor");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class PlayCommand extends BaseCommand{
    constructor() {super("play", ["p"], "Enqueue Youtube URL/Playlist/Tracks from search results", "CONNECT", "music", true, false, "<Youtube URL> or <Keywords>")}

    async run (para){
        // shortcut variables
        const { bot, message, voiceChannel } = para;
        const { author, channel } = message;

        let player = para.player;
        if(!player) {
            player = {
                textChannel: channel,
                voiceChannel: voiceChannel,
                connection: await voiceChannel.join(),
                queue: [],
                volume: 5,
                playing: true
            };
            bot.queue.set(message.guild.id, player);
        }
        
        // search for track(s) with the given arguments
        const query = para.args.join(" ");
        console.log(query);
        
        // if the queury is a youtube video link
        if(ytdl.validateURL(query)) {  
            // Get the song info
            await ytdl.getBasicInfo(query).then(async trackInfo => {
                const duration = await convertLenght(trackInfo.length_seconds);
                const track = {
                    id: trackInfo.video_id,
                    url: trackInfo.video_url,
                    title: trackInfo.title,
                    duration: duration,
                    thumbnail: trackInfo.player_response.videoDetails.thumbnail.thumbnails[3].url,
                    requester: message.author,
                };
                //console.log(track);
                player.queue.push(track);
                channel.send(`**${author.username}**-sama, Aqukin has enqueued track **${track.title}**`);
            });    
        }

        // if the queury is a youtube playlist link
        else if (ytpl.validateURL(query)){
            await ytpl(query, { limit:0 }).then(async playlist =>{
                playlist.items.forEach(trackInfo => {
                    const track = {
                        id: trackInfo.id,
                        url: trackInfo.url_simple,
                        title: trackInfo.title,
                        duration: trackInfo.duration,
                        thumbnail: trackInfo.thumbnail,
                        requester: message.author,
                    }
                    player.queue.push(track);
                });
                await channel.send(`**${author.username}**-sama, Aqukin has enqueued \`${playlist.total_items}\` track(s) from the playlist **${playlist.title}**`);
            });
        }
        else{
            await ytsr(query, {limit:10}).then(async results => {
                if(!results) { return channel.send(`**${author.username}**-sama, Aqukin can't find any tracks with the given keywords`, para.ridingAqua); }                
                const tracks = results.items.filter(i => i.type === "video");
                
                // embed the result(s)
                let i = 0;
                const tracksInfo = tracks.map(r => `${++i}) ${r.title}\n${r.link} | length \`${r.duration}s\``).join("\n\n"); // get the tracks info
                const embed = new MessageEmbed()
                    .setColor(0x1DE2FE)
                    .setTitle("Automatically times out in 12 seconds")
                    .setDescription(tracksInfo)
                    .setImage("https://media1.tenor.com/images/85e6b8577e925a9037d03a796588e7ed/tenor.gif?itemid=15925240")
                    .setFooter("Vive La Résistance le Hololive~");

                const sentMessage = await message.channel.send(`**${author}**-sama, please enter the track number that you would like Aqukin to queue.`, embed); // display the embed

                // Allow the author to select a track fron the search results within the allowed time of 12s
                const filter = m => (message.author.id === m.author.id) && (m.content >= 1 && m.content <= tracks.length);
                try{
                    sentMessage.delete({ timeout: 12000 });
                    const response = await message.channel.awaitMessages(filter, { max: 1, time: 12000, errors: ["time"]}) // await the user respond within 12s
                    const entry = await response.first().content;
                    const trackInfo = tracks[entry-1];
                    const track = {
                        id: await ytdl.getURLVideoID(trackInfo.link),
                        url: trackInfo.link,
                        title: trackInfo.title,
                        duration: trackInfo.duration,
                        thumbnail: trackInfo.thumbnail,
                        requester: message.author,
                    }
                    await player.queue.push(track);
                    response.first().delete(); // delete the user respond
                    message.channel.send(`**${author.username}**-sama, Aqukin has enqueued track **${tracks[entry-1].title}**`); // inform the author
                } catch(err) { return console.log(err); }
            });
        }

        try {
            if(!player.connection.dispatcher) { await playing(bot, message.guild, player); }
        } catch (err) {
            console.log(err);
            bot.queue.delete(message.guild.id);
        }
    } // end of run
}; // end of module.exports

async function playing(bot, guild, player){
    const track = player.queue[0];
    if (!track) {
        player.voiceChannel.leave();
        bot.queue.delete(guild.id);
        return;
    }
            
    // queue push
    const dispatcher = player.connection
        .play(await ytdl(track.url), { filter: 'audioonly' })
            
        .on("finish", () => {
            player.queue.shift();
            playing(bot, guild, player);
        })
                
        .on("error", console.error);
    player.textChannel.send(`**${track.requester.username}**-sama, Aqukin is now playing track **${track.title}**`)
}
    
