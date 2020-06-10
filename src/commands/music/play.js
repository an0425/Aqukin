/* This module allows the author to enqueue Youtube URL/Playlist/Tracks from search results to Aqukin audio streaming */
const ytpl = require("ytpl");
const ytsr = require("ytsr");
const ytdl = require("ytdl-core");
const { convertInput } = require("../../utilities/functions");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { musicEmbed } = require("../../utilities/embed_constructor");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class PlayCommand extends BaseCommand{
    constructor() {super("play", ["p"], "Enqueue Youtube URL/Playlist/Tracks from search results", "CONNECT", "music", true, "<Youtube URL> or <Keywords>", "https://www.youtube.com/watch?v=-aB6MQU8l1s -- will enqueue the song")}

    async run (para){
        // shortcut variables
        const { bot, message, voiceChannel } = para;
        const { author, channel } = message;

        // Create a player if the player for this guild does not exist
        let player = para.player;
        if(!player) {
            player = {
                id: message.guild.id,
                textChannel: channel,
                connection: await voiceChannel.join(),
                trackRepeat: false,
                queueRepeat: false,
                seeking: false,
                queue: [],
                loopqueue: []
            };
            await bot.music.set(message.guild.id, player);
        }
        
        // search for track(s) with the given arguments
        let noResult = false;
        const query = para.args.join(" ");
        console.log(query);
        
        // if the queury is a youtube video link
        if(ytdl.validateURL(query)) {  
            // Get the song info
            await ytdl.getBasicInfo(query).then(async trackInfo => {
                const track = {
                    id: trackInfo.player_response.videoDetails.videoId,
                    url: trackInfo.video_url,
                    title: trackInfo.player_response.videoDetails.title,
                    duration: trackInfo.player_response.videoDetails.lengthSeconds,
                    requester: message.author,
                };
                //console.log(track);
                await player.queue.push(track);
                channel.send(`**${author.username}**-sama, Aqukin has enqueued track **${track.title}** ٩(ˊᗜˋ*)و`);
            });    
        }
        // if the queury is a youtube playlist link
        else if (ytpl.validateURL(query)){
            await ytpl(query, { limit:0 }).then(async playlist =>{
                playlist.items.forEach(async trackInfo => {
                    const track = {
                        id: trackInfo.id,
                        url: trackInfo.url_simple,
                        title: trackInfo.title,
                        duration: await convertInput(trackInfo.duration),
                        requester: message.author,
                    }
                    await player.queue.push(track);
                });
                await channel.send(`**${author.username}**-sama, Aqukin has enqueued \`${playlist.total_items}\` track(s) from the playlist **${playlist.title}** ٩(ˊᗜˋ*)و`);
            })
            .catch((err) => {
                noResult = true;
                message.channel.send(`**${author.username}**-sama, the playlist is either private or does not exist 〣 (ºΔº) 〣`)});
        }
        // else try searching youtube with the given argument
        else{
            await ytsr(query, { limit:10 }).then(async results => {
                const tracks = results.items.filter(i => i.type === "video");

                if(!tracks) {
                    noResult = true;
                    channel.send(`**${author.username}**-sama, Aqukin can't find any tracks with the given keywords (｡T ω T｡)`, para.ridingAqua);
                    return; 
                }                
                
                // embed the result(s)
                let i = 0;
                const tracksInfo = await tracks.map(r => `${++i}) [${r.title}](${r.link}) | length \`${r.duration}\``).join("\n\n"); // get the tracks info
                const embed = new MessageEmbed()
                    .setColor(0x1DE2FE)
                    .setTitle("Automatically times out in 24 seconds")
                    .setDescription(tracksInfo)
                    .setImage("https://media1.tenor.com/images/85e6b8577e925a9037d03a796588e7ed/tenor.gif?itemid=15925240")
                    .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
                const sentMessage = await message.channel.send(`**${author.username}**-sama, please enter the track number that you would like Aqukin to queue ヽ (o´∀\`) ﾉ ♪ ♬`, embed); // display the embed

                // Allow the author to select a track fron the search results within the allowed time of 24s
                const filter = m => (message.author.id === m.author.id) && (m.content >= 1 && m.content <= tracks.length);
                try{
                    const response = await message.channel.awaitMessages(filter, { max: 1, time: 24000, errors: ["time"]}) // await the user respond within 24s
                    const entry = await response.first().content;
                    const trackInfo = tracks[entry-1];
                    const track = {
                        id: await ytdl.getURLVideoID(trackInfo.link),
                        url: trackInfo.link,
                        title: trackInfo.title,
                        duration: await convertInput(trackInfo.duration),
                        requester: message.author,
                    }
                    await player.queue.push(track);
                    response.first().delete(); // delete the user respond
                    message.channel.send(`**${author.username}**-sama, Aqukin has enqueued track **${tracks[entry-1].title}** ٩(ˊᗜˋ*)و`); // inform the author
                } catch(err) { 
                    noResult = true;
                    console.log(err);
                }
                sentMessage.delete(); // delete the search results embed 
            })
            .catch((err) => {
                noResult = true;
                channel.send(`**${author.username}**-sama, An error has occured while queuing (ಥ﹏ಥ)`, para.ridingAqua); 
                console.log(err)});
        } // end of else the given is keyword

        // Terminate the code if no results are found
        if(noResult) { return; }

        try {
            if(!player.connection.dispatcher) { await playing(bot, message.guild, player); }
        } catch (err) {
            console.log(err);
            bot.music.delete(message.guild.id);
        }

        // connection events
        await player.connection
            .on("error", console.error)

            .once("ready", async () => {
                console.log("ready to stream");
            })

            .once("disconnect", async () =>{
                try{ await player.sentMessage.delete(); }
                catch(err) { console.log("The message has already been manually deleted") }; // try catch in case the message got deleted manually
                if(player.seekingMsg) {
                    try{ 
                        await player.seekingMsg.delete(); 
                    }
                    catch(err) { console.log(err); }
                }
                await bot.music.delete(player.id);
                console.log("disconnected");
            });

        // Update the currently playing embed if it exists
        if(player.sentMessage){
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
    let track = player.queue[0];
    // Checks if the queue is empty
    if (!track) {
        // Repeat the queue if queueRepeat is set to true
        if(player.queueRepeat){
            player.queue = await player.queue.concat(player.loopqueue);
            await player.loopqueue.splice(0);
            track = player.queue[0];
        }
        // Else terminate the player
        else{
            try{
                await player.connection.channel.leave();
                await bot.music.delete(guild.id);
                const sentMessage = await player.textChannel.send("The queue has ended, arigatou gozaimatshita ☆ ⌒ ヽ (* '､ ^ *) chu~", new MessageAttachment("src/utilities/pictures/bye.gif"));
                await sentMessage.delete({ timeout: 5200 });
            } catch (err) { console.log(err); }
            return;
        }
    } // end of if the queue is empty
            
    // Else the queue is not empty, setup the neccessary events for the dispatcher
    const dispatcher = player.connection
        .play(await ytdl(track.url), { filter: "audioonly", seek: track.seek || 0 })

        .on("error", console.error)

        .on("start", async () =>{
            if(player.seeking){
                try{ 
                    //console.log(player, player.seekingMsg);
                    await player.seekingMsg.delete(); 
                }
                catch(err) { console.log(err); }
                player.seeking = false;
            }
            
            // Now playing embed constructing and sending
            const embed = await musicEmbed(bot, player, track);
            try{ player.sentMessage = await player.textChannel.send(embed)  } // send the embed to inform about the now playing track
            catch(err) { console.log("an error has occurered trying to send the embed", err); }
        })    
            
        .on("finish", async () => {
            try{ await player.sentMessage.delete(); }
            catch(err) { console.log("The message has already been manually deleted") }; // try catch in case the message got deleted manually
            
            // loop status checks
            if(!player.seeking) {
                await bot.votingSystem.clear();
                player.queue[0].seek = 0;
                if(player.trackRepeat) { await player.queue.splice(1, 0, player.queue[0]); }
                else if(player.queueRepeat) { await player.loopqueue.push(player.queue[0]); }
            }
            
            await player.queue.shift();
            await playing(bot, guild, player);
            //player.seeking = false;
        });
} // end of playing(...) function
    
