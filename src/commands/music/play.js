/* This module allows the author to enqueue Youtube URL/Playlist/Tracks from search results to Aqukin audio streaming */
const ytdl = require("ytdl-core");
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
        const validate = await ytdl.validateURL(query);
        
        // checks if there any search result(s), if not return a message to inform the author
        if(!validate) { return channel.send(`**${author.username}**-sama, Aqukin can't find any tracks with the given keywords`, para.ridingAqua); }

        // Get the song info
        let track;
        await ytdl.getBasicInfo(query).then(trackInfo => {
            track = {
                id: trackInfo.video_id,
                url: trackInfo.video_url,
                title: trackInfo.title,
                duration: trackInfo.length_seconds,
                thumbnailUrl: trackInfo.player_response.videoDetails.thumbnail.thumbnails[3].url,
                seekable: trackInfo.player_response.videoDetails.isCrawlable,
                isPrivate: trackInfo.player_response.videoDetails.isPrivate,
                isStream: trackInfo.player_response.videoDetails.isLiveContent,
                requester: message.author,
            };
        });
       
        console.log(track);
        player.queue.push(track);
        channel.send(`**${author.username}**-sama, Aqukin has enqueued track **${track.title}**`);

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
    
