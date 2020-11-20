/* This module allows the author to enqueue Youtube URL/Playlist/Tracks from search results to the bot audio streaming */
const ytpl = require("ytpl");
const ytsr = require("ytsr");
const ytdl = require("ytdl-core");
const { MessageEmbed } = require("discord.js");
const { musicEmbed } = require("../../utilities/embed_constructor");
const { convertInput } = require("../../utilities/functions");
const BaseCommand = require("../../utilities/structures/BaseCommand");
const BasePlayer = require("../../utilities/structures/BasePlayer");


module.exports = class PlayCommand extends BaseCommand{
    constructor() {
        super("play", ["p"], "Enqueue Youtube Video/Playlist/Track from given URL search results", "CONNECT", "music", true, "<Youtube URL/Keywords>", "https://www.youtube.com/watch?v=-aB6MQU8l1s -- will enqueue the song");
    }

    async run (para){
        // shortcut variables
        const { bot, message, voiceChannel } = para;
        const { author, channel } = message;

        // create a player if the player for this guild does not exist
        let player = await para.player || new BasePlayer(bot, message.guild.id, channel);

        // search for track(s) with the given arguments
        let noResult = false;
        const query = para.args.join(" ");
        //console.log(query);
        
        // if the queury is a youtube video link
        if(ytdl.validateURL(query)) {  
            // Get the song info
            await ytdl.getBasicInfo(query).then(async trackInfo => {
                const track = {
                    id: trackInfo.player_response.videoDetails.videoId,
                    url: trackInfo.videoDetails.video_url,
                    title: trackInfo.player_response.videoDetails.title,
                    duration: trackInfo.player_response.videoDetails.lengthSeconds,
                    requester: message.author,
                };
                //console.log(trackInfo);
                await player.queue.push(track);
                channel.send(`**${author.username}**-sama, ${bot.user.username} has enqueued track \`${track.title}\` ٩(ˊᗜˋ*)و`);
            }).catch((err) => {
                noResult = true;
                message.channel.send(`**${author.username}**-sama, \`${err}\``)});   
        }
        // if the queury is a youtube playlist link
        else if ( ytpl.validateID(query) ){
            await ytpl(query, { limit: Infinity }).then(async playlist =>{
                const oldLenght = player.queue.length || 0; // old queue length before the playlist
                //console.log(playlist);

                playlist.items.forEach(async trackInfo => {
                    //console.log(trackInfo);
                    if(trackInfo.duration){
                        const track = {
                            id: trackInfo.id,
                            url: trackInfo.url,
                            title: trackInfo.title,
                            duration: convertInput(trackInfo.duration),
                            requester: message.author,
                        }
                        
                        await player.queue.push(track);
                    }
                });

                await channel.send(`**${author.username}**-sama, ${bot.user.username} has enqueued \`${player.queue.length - oldLenght}\` track(s) from the playlist \`${playlist.title}\` ٩(ˊᗜˋ*)و`);
            })
            .catch((err) => {
                noResult = true;
                console.log(err);
                message.channel.send(`**${author.username}**-sama, \`${err}\``)});
        }
        // else try searching youtube with the given argument
        else{
            await ytsr(query, { limit:7 }).then(async results => {
                const tracks = results.items.filter(i => i.type === "video");
                if(tracks.length === 0) {
                    noResult = true;
                    channel.send(`**${author.username}**-sama, ${bot.user.username} can't find any tracks with the given keywords (｡T ω T｡)`, para.ridingAqua);
                    return; 
                }                
                
                // embed the result(s)
                let i = 0;
                const tracksInfo = await tracks.map(r => `${++i}) [${r.title}](${r.link}) | length \`${r.duration}\``).join("\n\n"); // get the tracks info
                const embed = new MessageEmbed()
                    .setColor(bot.media.embedColour[Math.floor(Math.random() * Math.floor(bot.media.embedColour.length))])
                    .setTitle("Automatically times out in 24 seconds")
                    .setDescription(tracksInfo)
                    .setImage("https://media1.tenor.com/images/85e6b8577e925a9037d03a796588e7ed/tenor.gif?itemid=15925240")
                    .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
                await message.channel.send(`**${author.username}**-sama, please enter the track number that you would like ${bot.user.username} to queue ヽ (o´∀\`) ﾉ ♪ ♬`, embed)
                    .then(async (msg) => {
                        // allow the author to select a track fron the search results within the allowed time of 24s
                        const filter = m => (message.author.id === m.author.id) && (m.content >= 1 && m.content <= tracks.length);

                        // await the user respond within 24s
                        await message.channel.awaitMessages(filter, { max: 1, time: 24000, errors: ["time"] })
                            .then(async (response) => {
                                const entry = await response.first().content;
                                const trackInfo = tracks[entry-1];
                                const track = {
                                    id: ytdl.getURLVideoID(trackInfo.link),
                                    url: trackInfo.link,
                                    title: trackInfo.title,
                                    duration: convertInput(trackInfo.duration),
                                    requester: message.author,
                                }
                                //console.log(trackInfo, track);
                                await player.queue.push(track);
                                response.first().delete().catch(err => console.log(err)); // delete the user respond
                                message.channel.send(`**${author.username}**-sama, ${bot.user.username} has enqueued track \`${tracks[entry-1].title}\` ٩(ˊᗜˋ*)و`); // inform the author
                            })
                            .catch(err =>{
                                noResult = true;
                                console.log(err);
                            });

                        // delete the search results embed 
                        msg.delete(); 
                    })
                    .catch(err => {
                        noResult = true;
                        console.log(err);
                    });
            })
            .catch((err) => {
                noResult = true;
                channel.send(`**${author.username}**-sama, \`${err}\``, para.ridingAqua); 
                console.log("An error has occured while enqueuing", err)});
        } // end of else the given is keyword

        // terminate the code if no results are found
        if(noResult){
            if(player.queue.length === 0){
                //await player.connection.disconnect();
                await bot.music.delete(player.id);
            }
            return;
        }

        if(!player.connection) { 
            player.connection = await voiceChannel.join();
            //await player.play(bot, ytdl);
            await playing(bot, player).catch (err => {
                console.log(err);
                message.channel.send(`**${author.username}**-sama, \`${err}\``);   
                bot.music.delete(message.guild.id);
            }); 
        }

        // update the currently playing embed if it exists
        if(player.sentMessage){
            player.updateEmbed(bot);
        }
    } // end of run
}; // end of module.exports

async function playing(bot, player){
    let track = player.queue[0];
    // checks if the queue is empty
    if (!track) {
        // repeat the queue if queueRepeat is set to true
        if(player.queueRepeat){
            player.queue = await player.queue.concat(player.loopqueue);
            await player.loopqueue.splice(0);
            track = player.queue[0];
        }
        // else terminate the player
        else{
            try{
                await player.connection.disconnect();
                player.textChannel.send("The queue has ended, arigatou gozaimatshita ☆ ⌒ ヽ (* '､ ^ *) chu~", { files: ["https://media1.tenor.com/images/2acd2355ad05655cb2a536f44660fd23/tenor.gif?itemid=17267169"] })
                    .then(msg => msg.delete({ timeout: 5200 })).catch(console.error);
            } catch (err) { console.log(err); }
            return;
        }
    } // end of if the queue is empty
            
    // else the queue is not empty, setup the neccessary events for the dispatcher
    let ytdlOptions = { filter: "audio", formatFallback: "filtered"/*, quality: "highestaudio", highWaterMark: 1 << 25 */ };
    let dispatcherOptions = { volume: player.volume ? player.volume : 1 };
    if(track.duration > 600){
        ytdlOptions.begin = track.seek ? track.seek*1000 : 0;
    }
    else{
        dispatcherOptions.seek = track.seek ? track.seek : 0;
    }
    
    // VoiceBroadcast events
    const dispatcher = await player.connection.play(ytdl(track.url, ytdlOptions), dispatcherOptions)
        .on("error", async (err) =>{
            await player.textChannel.send(`**${player.queue[0].requester.username}**-sama, \`${err}\` has occured when ${bot.user.username} was trying to play track \`${track.title}\` 。 ゜ ゜ (´Ｏ\`) ゜ ゜。`);
        })

        .on("start", async () =>{
            // now playing embed constructing and sending
            player.seeking = false;
            const embed = await musicEmbed(bot, player, track);
            // send the embed to inform about the now playing track
            player.sentMessage = await player.textChannel.send(embed).catch(console.error);
        })
        
        .on("finish", async () =>{
            await dispatcher.destroy();
        })
        .once("close", async () => {
            // loop status checks
            if(!player.seeking) {
                await bot.votingSystem.delete(player.id);
                if(player.trackRepeat) { await player.queue.splice(1, 0, player.queue[0]); }
                else if(player.queueRepeat) { await player.loopqueue.push(player.queue[0]); }
                if(player.queue[0]) { player.queue[0].seek = 0; }
            }

            await player.queue.shift();
            await playing(bot, player);
            await player.sentMessage.delete().catch(console.error); // try catch in case the message got deleted manually
        });

    // VoiceConnection events
    player.connection.on("error", async (err) =>{
        await player.textChannel.send(`**${author.username}**-sama, \`${err}\` 。 ゜ ゜ (´Ｏ\`) ゜ ゜。`);
        await bot.music.delete(player.id);
    })

    .once("disconnect", async () =>{
        await player.queue.splice(0);
        if(player.connection.dispatcher){ await player.connection.dispatcher.end(); }
        await bot.votingSystem.delete(player.id);
        await bot.music.delete(player.id);
    });
} // end of playing(...) function 

