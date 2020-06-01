/* This module allows the author to enqueue Youtube URL/Playlist/Tracks from search results to Aqukin audio streaming */
const ytdl = require("ytdl-core");
// const { musicEmbed } = require("../../utilities/embed_constructor");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class PlayCommand extends BaseCommand{
    constructor() {super("play", ["p"], "Enqueue Youtube URL/Playlist/Tracks from search results", "CONNECT", "music", true, false, "<Youtube URL> or <Keywords>")}

    async run (para){
        // shortcut variables
        const { bot, message, player, voiceChannel } = para;
        const { author, channel } = message;
        
        // search for track(s) with the given arguments
        const query = para.args.join(" ");
        console.log(query);
        const validate = await ytdl.validateURL(query);
        
        // checks if there any search result(s), if not return a message to inform the author
        if(!validate) { return channel.send(`**${author.username}**-sama, Aqukin can't find any tracks with the given keywords`, para.ridingAqua); }

       // Get the song info
       const songInfo = await ytdl.getInfo(para.args[0]);
       const song = {
           title: songInfo.title,
           url: songInfo.video_url,
       };

       if (!player) {
           const playerContruct = {
               textChannel: channel,
               voiceChannel: voiceChannel,
               connection: null,
               songs: [],
               volume: 5,
               playing: true
            };
            bot.queue.set(message.guild.id, playerContruct);
        
            playerContruct.songs.push(song);
        
            try {
                var connection = await voiceChannel.join();
                playerContruct.connection = connection;
                await playing(bot, message.guild, playerContruct.songs[0], author);
            } catch (err) {
                console.log(err);
                bot.queue.delete(para.message.guild.id);
                return channel.send(err);
            }
        }
        else{
            player.songs.push(song);
            return channel.send(`**${author.username}**-sama, Aqukin has queued: **${song.title}**`);
        }
    } // end of run
}; // end of module.exports

async function playing(bot, guild, song, author){
    const player = bot.queue.get(guild.id);
    if (!song) {
        player.voiceChannel.leave();
        bot.queue.delete(guild.id);
        return;
    }
            
    // queue push
    const dispatcher = player.connection
        .play(await ytdl(song.url), { filter: 'audioonly' })
            
        .on("finish", () => {
            player.songs.shift();
            playing(bot, guild, player.songs[0]);
        })
                
        .on("error", console.error);
    player.textChannel.send(`**${author.username}**-sama, Aqukin is now playing: **${song.title}**`)
}
    
