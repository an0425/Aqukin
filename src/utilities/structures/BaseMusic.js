const ytpl = require("ytpl");
const ytsr = require("ytsr");
const ytdl = require("ytdl-core");
const { MessageEmbed } = require("discord.js");
const { musicEmbed } = require("../embed_constructor");
const { convertInput, formatLength } = require("../functions");

class BaseOpus{
    constructor (id, textChannel){
        this.id = id,
        this.textChannel = textChannel,
        this.trackRepeat = false,
        this.queueRepeat = false,
        this.seeking = false,
        this.queue = [],
        this.loopqueue = []            
    }
    
    async updateEmbed(bot){
        const embed = await musicEmbed(bot, this, this.queue[0]);
        await this.sentMessage.edit(embed).catch(async err => { this.sentMessage = await this.textChannel.send(embed); });
    }

    async initPlayer(voiceChannel, bot, authorName){

        this.connection = await voiceChannel.join();
        this.connection
            .once("error", async (err) =>{
                await this.textChannel.send(`**${authorName}**-sama, \`${err}\` has happen to ${bot.user.username} voice connection 。 ゜ ゜ (´Ｏ\`) ゜ ゜。`);
                await bot.music.delete(this.id);
            })

            .once("disconnect", async () =>{     
                this.queueRepeat = false;           
                await this.queue.splice(0);
                if(this.connection.dispatcher){ await this.connection.dispatcher.end(); }
                await bot.votingSystem.delete(this.id);
                await bot.music.delete(this.id);
            }); 
    }

    // search for track(s) with the given arguments
    async getTracks(bot, query, channel, author, ridingAqua){
        let result = [];
                // if the given queuery is a url
                if(query.startsWith("https://")){
                    // if the queury is a youtube video link
                    if(ytdl.validateURL(query)) {  
                        // Get the song info
                        await ytdl.getBasicInfo(query).then(async trackInfo => {
                            //console.log(trackInfo);
                            const { videoId, title, lengthSeconds } = trackInfo.player_response.videoDetails;
        
                            result.push(new Track(videoId, trackInfo.videoDetails.video_url, title, lengthSeconds*1000, author));
        
                            channel.send(`**${author.username}**-sama, ${bot.user.username} has enqueued track \`${title}\` ٩(ˊᗜˋ*)و`);
                        }).catch((err) => channel.send(`**${author.username}**-sama, \`${err}\``));   
                    } // video link
                    
                    // if the queury is a youtube playlist link
                    else if (ytpl.validateID(query)){
                        await ytpl(query, { limit: Infinity }).then(async playlist =>{
                            //console.log(playlist);
            
                            playlist.items.forEach(async trackInfo => {
                                //console.log(trackInfo);
                                if(trackInfo.duration)
                                {
                                    result.push(new Track(trackInfo.id, trackInfo.url, trackInfo.title, convertInput(trackInfo.duration), author));
                                }
                            });
            
                            await channel.send(`**${author.username}**-sama, ${bot.user.username} has enqueued \`${result.length}\` track(s) from the playlist \`${playlist.title}\` ٩(ˊᗜˋ*)و`);
                        })
                        .catch((err) => {
                            console.log(err);
                            channel.send(`**${author.username}**-sama, \`${err}\``)});
                    } // playlist link
                }
                // else try searching youtube with the given argument
                else{
                    await ytsr(query, { limit:7 }).then(async results => {
                        const tracks = results.items.filter(i => i.type === "video");
                        if(tracks.length === 0) {
                            channel.send(`**${author.username}**-sama, ${bot.user.username} can't find any tracks with the given keywords (｡T ω T｡)`, ridingAqua);
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
                        await channel.send(`**${author.username}**-sama, this embed will time out in 24 seconds`, embed)
                            .then(async (msg) => {
                                // allow the author to select a track fron the search results within the allowed time of 24s
                                const filter = m => (author.id === m.author.id) && (m.content >= 0 && m.content <= tracks.length);
        
                                // await the user respond within 24s
                                await channel.awaitMessages(filter, { max: 1, time: 24000, errors: ["time"] })
                                    .then(async (response) => {
                                        // delete & capture the author's response
                                        await response.first().delete().then(async (entry) => {
                                            if(entry.content > 0){
                                                const trackInfo = tracks[entry.content-1];
            
                                                result.push(new Track(trackInfo.id, trackInfo.url, trackInfo.title, convertInput(trackInfo.duration), author));
            
                                                channel.send(`**${author.username}**-sama, ${bot.user.username} has enqueued track \`${trackInfo.title}\` ٩(ˊᗜˋ*)و`); // inform the author
                                            }
                                        }).catch(console.error); // capture & delete the author's respond
                                        
                                    }).catch(console.error);
                                
                                    msg.delete(); // delete the search results embed 
                            }).catch(console.error);
                    }).catch((err) => {
                        channel.send(`**${author.username}**-sama, \`${err}\``, ridingAqua); 
                        console.log("An error has occured while enqueuing", err);
                    });
                } // end of else the given is keyword

        return result;
    }

    async playing(bot){
        let track = this.queue[0];
    
        // checks if the queue is empty
        if (!track) {
            // repeat the queue if queueRepeat is set to true
            if(this.queueRepeat){
                this.queue.push(...this.loopqueue);
                track = this.queue[0];
                await this.loopqueue.splice(0);
            }
            // else terminate the player
            else{
                try{
                    await this.connection.disconnect();
                    this.textChannel.send("The queue has ended, arigatou gozaimatshita ☆ ⌒ ヽ (* '､ ^ *) chu~", { files: ["https://media1.tenor.com/images/2acd2355ad05655cb2a536f44660fd23/tenor.gif?itemid=17267169"] })
                        .then(msg => msg.delete({ timeout: 5200 })).catch(console.error);
                } catch (err) { console.log(err); }
                return;
            }
        } // end of if the queue is empty
        
        const ytdlOptions = { filter: "audio", formatFallback: "filtered", quality: "highestaudio"/* , highWaterMark: 1 << 25 */ }
        const dispatcherOptions = { volume: this.volume || 1 }
        
        if(track.force){
            dispatcherOptions.seek = track.seek/1000 || 0;
        }
        else{
            ytdlOptions.begin = track.seek || 0;
            if(track.seek){
                this.textChannel.send(`If the track is playing from start, try \`forced move\` by adding \`-f\` to the end of the command.`)
                        .then(msg => msg.delete({ timeout: 5200 })).catch(console.error);
            }   
        }
    
        // VoiceBroadcast events
        const dispatcher = await this.connection.play(ytdl(track.url, ytdlOptions), dispatcherOptions)
            .once("error", async (err) =>{
                await this.textChannel.send(`**${track.requester.username}**-sama, \`${err}\` has occured when ${bot.user.username} was trying to play track \`${track.title}\` 。 ゜ ゜ (´Ｏ\`) ゜ ゜。`);
            })
    
            .once("start", async () =>{
                // now playing embed constructing and sending
                track.seek = null;
                track.fast = null;
                const embed = await musicEmbed(bot, this, track);
                // send the embed to inform about the now playing track
                this.sentMessage = await this.textChannel.send(embed).catch(console.error);
            })
            .once("finish", async () =>{
                await dispatcher.destroy();
            })
            .once("close", async () => {
                // loop status checks
                if(!track.seek){
                    await bot.votingSystem.delete(this.id);
                    if(this.trackRepeat) { await this.queue.splice(1, 0, this.queue[0]); }
                    else if(this.queueRepeat) { await this.loopqueue.push(this.queue[0]); }
                }
                
                await this.queue.shift();
                await this.playing(bot);
                await this.sentMessage.delete().catch(console.error); // try catch in case the message got deleted manually
            }); 
    } // end of playing(...) function 

} // end of BaseOpus

class Track{
    constructor (id, url, title, duration, requester){
        this.id = id;
        this.url = url;
        this.title = title;
        this.duration = duration;
        this.requester = requester;
    }
}

async function getTracksL(bot, searchResults, channel, author, ridingAqua){
    let result = [];

    // a case for single link song
    switch(searchResults.loadType){
        case "TRACK_LOADED":
            await result.push(searchResults.tracks[0]); // enque
            await channel.send(`**${author.username}**-sama, ${bot.user.username} has enqueued track \`${searchResults.tracks[0].title}\``); // inform the author
            break;

        case "PLAYLIST_LOADED":
            //console.log(searchResults.tracks);
            await searchResults.tracks.forEach(track => result.push(track));
            channel.send(`**${author.username}**-sama, Aqukin has enqueued \`${searchResults.tracks.length}\` tracks from the playlist \`${searchResults.playlist.name}\`| total length \`${formatLength(searchResults.playlist.duration, false, true)}\``);
            break;

        case "SEARCH_RESULT":
            let i = 0;
            const tracks = await searchResults.tracks.slice(0, 7);
            const tracksInfo = await tracks.map(r => `${++i}) [${r.title}](${r.uri}) | length \`${formatLength(r.duration, false, true)}\``).join("\n\n"); // get the tracks info
            // embed the result(s)
            const embed = new MessageEmbed()
                .setColor(bot.media.embedColour.random())
                .setTitle(`Please enter the \`track number\` that you would like ${bot.user.username} to queue, or \`0\` to cancel`)
                .setDescription(tracksInfo)
                .setImage("https://media1.tenor.com/images/85e6b8577e925a9037d03a796588e7ed/tenor.gif?itemid=15925240")
                .setFooter("FREEDOM SMILE (^)o(^)b");

            /* Allow the author to select a track fron the search results within the allowed time of 24s */
            await channel.send(`**${author.username}**-sama, this embed will time out in 24 seconds`, embed)
                .then(async (msg) => {
                    const filter = m => (author.id === m.author.id) && (m.content >= 0 && m.content <= tracks.length);
                    // await the user respond within 24s
                    await channel.awaitMessages(filter, { max: 1, time: 24000 }) 
                        .then(async (response) => {
                            const entry = await response.first().content;
                            if(entry > 0){
                                await result.push(tracks[entry-1]); // enqueue
                                await channel.send(`**${author.username}**-sama, ${bot.user.username} has enqueued track \`${tracks[entry-1].title}\``); // inform the author
                            }
                            await response.first().delete(); // delete the user respond
                        }).catch(err => console.log(err));

                    await msg.delete();
                }).catch(err => console.log(err));
            break;

            case "LOAD_FAILED":
                return channel.send(`**${author.username}**-sama, \`${searchResults.exception.message}\``);

            default:
                return channel.send(`**${author.username}**-sama, ${bot.user.username} can't find any tracks with the given keywords, please also note that Aqukin will not queue Youtube Audio Mix or Stream`, ridingAqua);
    }
    return result;
}

module.exports = { BaseOpus, getTracksL }