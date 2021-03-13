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
        super("play", ["p"], "Enqueue Youtube Video/Playlist/Track from given URL search results", "CONNECT", "music", true, "<Youtube URL/Keywords>", "https://www.youtube.com/watch?v=6bnaBnd4kyU -- will enqueue the song \`#Aqua Iro Palette - Minato Aqua\`");
    }

    async run (para){
        // shortcut variables
        const { bot, message, voiceChannel } = para;
        const { author, channel } = message;

        // create a player if the player for this guild does not exist
        let player = await para.player || new BasePlayer(message.guild.id, channel);

        // search for track(s) with the given arguments
        const query = para.args.join(" ");
        const initQueue = player.queue.length;
        //console.log(query);
        
        // if the given queuery is a url
        if(query.startsWith("https://")){
            // if the queury is a youtube video link
            if(ytdl.validateURL(query)) {  
                // Get the song info
                await ytdl.getBasicInfo(query).then(async trackInfo => {
                    //console.log(trackInfo);
                    const { videoId, title, lengthSeconds } = trackInfo.player_response.videoDetails;

                    await player.queue.push(new Track(videoId, trackInfo.videoDetails.video_url, title, lengthSeconds*1000, message.author));

                    channel.send(`**${author.username}**-sama, ${bot.user.username} has enqueued track \`${title}\` ٩(ˊᗜˋ*)و`);
                }).catch((err) => message.channel.send(`**${author.username}**-sama, \`${err}\``));   
            } // video link
            
            // if the queury is a youtube playlist link
            else if (ytpl.validateID(query)){
                await ytpl(query, { limit: Infinity }).then(async playlist =>{
                    const oldLenght = player.queue.length || 0; // old queue length before the playlist
                    //console.log(playlist);
    
                    playlist.items.forEach(async trackInfo => {
                        //console.log(trackInfo);
                        if(trackInfo.duration)
                        {
                            await player.queue.push(new Track(trackInfo.id, trackInfo.url, trackInfo.title, convertInput(trackInfo.duration), message.author));
                        }
                    });
    
                    await channel.send(`**${author.username}**-sama, ${bot.user.username} has enqueued \`${player.queue.length - oldLenght}\` track(s) from the playlist \`${playlist.title}\` ٩(ˊᗜˋ*)و`);
                })
                .catch((err) => {
                    console.log(err);
                    message.channel.send(`**${author.username}**-sama, \`${err}\``)});
            } // playlist link
        }
        // else try searching youtube with the given argument
        else{
            await ytsr(query, { limit:7 }).then(async results => {
                const tracks = results.items.filter(i => i.type === "video");
                if(tracks.length === 0) {
                    channel.send(`**${author.username}**-sama, ${bot.user.username} can't find any tracks with the given keywords (｡T ω T｡)`, para.ridingAqua);
                    return; 
                }
                                
                // embed the result(s)
                let i = 0;
                const tracksInfo = await tracks.map(r => `${++i}) [${r.title}](${r.url}) | length \`${r.duration}\``).join("\n\n"); // get the tracks info
                const embed = new MessageEmbed()
                    .setColor(bot.media.embedColour.random())
                    .setTitle(`Please enter the \`track number\` that you would like ${bot.user.username} to queue, or \`0\` to cancel ヽ (o´∀\`) ﾉ ♪ ♬`)
                    .setDescription(tracksInfo)
                    .setImage("https://media1.tenor.com/images/85e6b8577e925a9037d03a796588e7ed/tenor.gif?itemid=15925240")
                    .setFooter("FREEDOM SMILE (^)o(^)b");
                await message.channel.send(`**${author.username}**-sama, this embed will time out in 24 seconds`, embed)
                    .then(async (msg) => {
                        // allow the author to select a track fron the search results within the allowed time of 24s
                        const filter = m => (message.author.id === m.author.id) && (m.content >= 0 && m.content <= tracks.length);

                        // await the user respond within 24s
                        await message.channel.awaitMessages(filter, { max: 1, time: 24000, errors: ["time"] })
                            .then(async (response) => {
                                // delete & capture the author's response
                                await response.first().delete().then(async (entry) => {
                                    if(entry.content > 0){
                                        const trackInfo = tracks[entry.content-1];
    
                                        await player.queue.push(new Track(trackInfo.id, trackInfo.url, trackInfo.title, convertInput(trackInfo.duration), message.author));
    
                                        message.channel.send(`**${author.username}**-sama, ${bot.user.username} has enqueued track \`${trackInfo.title}\` ٩(ˊᗜˋ*)و`); // inform the author
                                    }
                                }).catch(console.error); // capture & delete the author's respond
                                
                            }).catch(console.error);
                        
                            msg.delete(); // delete the search results embed 
                    }).catch(console.error);
            }).catch((err) => {
                channel.send(`**${author.username}**-sama, \`${err}\``, para.ridingAqua); 
                console.log("An error has occured while enqueuing", err);
            });
        } // end of else the given is keyword

        if(!player.connection && player.queue.length > 0) {
            await player.initPlayer(voiceChannel, bot, author.username);
            await bot.music.set(message.guild.id, player); 

            await playing(bot, player).catch (err => {
                console.log(err);
                message.channel.send(`**${author.username}**-sama, \`${err}\``);   
                bot.music.delete(message.guild.id);
            }); 
        }

        // update the currently playing embed if it exists
        if(player.sentMessage && player.queue.length > initQueue){
            player.updateEmbed(bot);
        }
    } // end of run
}; // end of module.exports

class Track{
    constructor (id, url, title, duration, requester){
        this.id = id;
        this.url = url;
        this.title = title;
        this.duration = duration;
        this.requester = requester;
    }
}

async function playing(bot, player){
    let track = player.queue[0];

    // checks if the queue is empty
    if (!track) {
        // repeat the queue if queueRepeat is set to true
        if(player.queueRepeat){
            player.queue = await player.queue.concat(player.loopqueue);
            track = player.queue[0];
            await player.loopqueue.splice(0);
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
    
    const ytdlOptions = { filter: "audio", formatFallback: "filtered", quality: "highestaudio"/* , highWaterMark: 1 << 25 */ }
    const dispatcherOptions = { volume: player.volume || 1 }
    
    if(track.force){
        dispatcherOptions.seek = track.seek/1000 || 0;
    }
    else{
        ytdlOptions.begin = track.seek || 0;
        if(track.seek){
            player.textChannel.send(`If the track is playing from start, try \`forced move\` by adding \`-f\` to the end of the command.`)
                    .then(msg => msg.delete({ timeout: 5200 })).catch(console.error);
        }   
    }

    // VoiceBroadcast events
    const dispatcher = await player.connection.play(ytdl(track.url, ytdlOptions), dispatcherOptions)
        .once("error", async (err) =>{
            await player.textChannel.send(`**${player.queue[0].requester.username}**-sama, \`${err}\` has occured when ${bot.user.username} was trying to play track \`${track.title}\` 。 ゜ ゜ (´Ｏ\`) ゜ ゜。`);
        })

        .once("start", async () =>{
            // now playing embed constructing and sending
            track.seek = null;
            track.fast = null;
            const embed = await musicEmbed(bot, player, track);
            // send the embed to inform about the now playing track
            player.sentMessage = await player.textChannel.send(embed).catch(console.error);
        })
        .once("finish", async () =>{
            await dispatcher.destroy();
        })
        .once("close", async () => {
            // loop status checks
            if(!track.seek){
                await bot.votingSystem.delete(player.id);
                if(player.trackRepeat) { await player.queue.splice(1, 0, player.queue[0]); }
                else if(player.queueRepeat) { await player.loopqueue.push(player.queue[0]); }
            }
            
            await player.queue.shift();
            await playing(bot, player);
            await player.sentMessage.delete().catch(console.error); // try catch in case the message got deleted manually
        }); 
} // end of playing(...) function 

