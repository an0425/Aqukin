/* This module allows the author to enqueue Youtube URL/Playlist/Tracks from search results to Aqukin audio streaming */
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const ytsr = require("ytsr");
const { MessageEmbed } = require("discord.js");
const { formatLength } = require("../../utilities/functions");
const { registerMusicEvents } = require("../../utilities/handlers");
const { musicEmbed } = require("../../utilities/embed_constructor");
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
                const duration = await formatLength(trackInfo.videoDetails.lengthSeconds);
                const track = {
                    id: trackInfo.videoDetails.videoId,
                    url: trackInfo.videoDetails.video_url,
                    title: trackInfo.videoDetails.title,
                    duration: duration,
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

        if(player.sentMessage){
            // Update the currently playing embed
            const embed = await musicEmbed(para.bot, player, player.queue[0])
            try{
                await player.sentMessage.edit(embed); // send the embed to inform about the now playing track
            } catch(err) {
                console.log("Recreating the deleted music embed", err);
                player.sentMessage = await player.textChannel.send(embed);
            }
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
            
    // dispatcher events
    const dispatcher = player.connection
        .play(await ytdl(track.url), { filter: "audioonly" })
            
        .on("finish", async () => {
            try{ await player.sentMessage.delete(); }
            catch(err) { console.log("The message has already been manually deleted\n", err) }; // try catch in case the message got deleted manually
            await bot.votingSystem.clear();
            await player.queue.shift();
            playing(bot, guild, player);
        })

        .on("start", async () =>{
            const embed = await musicEmbed(bot, player, track);
            try{ player.sentMessage = await player.textChannel.send(embed); } // send the embed to inform about the now playing track
            catch(err) { console.log("The message is terminated abnormally", err); }
        })
                
        .on("error", console.error);

    // connection events
    player.connection
        .once("ready", async () => {
            console.log("ready to stream")
        })

        .once("disconnect", async () =>{
            await player.queue.splice(0);
            try{ await player.sentMessage.delete(); }
            catch(err) { console.log("The message has already been manually deleted\n", err) }; // try catch in case the message got deleted manually
            await player.connection.disconnect();
            console.log("disconnected");
        })

        .on("newSession", async () =>{
            console.log("moved");
        })

        .on("error", console.error);
}
    
