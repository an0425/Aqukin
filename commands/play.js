/* This module allows the author to queue youtube URL or keyword to Aqukin audio streaming */
const ytdl = require("ytdl-core-discord");

module.exports = {
    name: "play",
    aliases: ["p"],
    tag: "music",
    permission: "CONNECT",
    args: true,
    usage: "<Youtube URL>",

    async execute(para){
        const author = para.message.author.username; // message's author username
        const channel = para.message.channel; // para.message.channel for short

        // Checks if the author is in an voice channel
        const voiceChannel = para.message.member.voice.channel;
        if (!voiceChannel) return channel.send(`${author}-sama, you need to be in a voice channel first to use this command`);

        // Checks if the argument is an URL
        let validate = ytdl.validateURL(para.args[0]);
        if (!validate) return channel.send(`${author}-sama, this is not a Youtube URL`);

        // Get the song info
        const songInfo = await ytdl.getInfo(para.args[0]);
        const song = {
            title: songInfo.title,
            url: songInfo.video_url,
        };

        /* This function */
        async function playing(bot, guild, song) {
            const serverQueue = bot.queue.get(guild.id);
            if (!song) {
              serverQueue.voiceChannel.leave();
              bot.queue.delete(guild.id);
              return;
            }
            
            // queue push
            const dispatcher = serverQueue.connection
                .play(await ytdl(song.url), {type: "opus", highWaterMark: 24})
            
                .on("finish", () => {
                    serverQueue.songs.shift();
                    playing(bot, guild, serverQueue.songs[0]);
                })
                
                .on("error", console.error);
                serverQueue.textChannel.send(`${author}-sama, Aqukin is now playing: **${song.title}**`)
        }

        if (!para.serverQueue) {
            const queueContruct = {
              textChannel: channel,
              voiceChannel: voiceChannel,
              connection: null,
              songs: [],
              volume: 5,
              playing: true
            };
        
            para.bot.queue.set(para.message.guild.id, queueContruct);
        
            queueContruct.songs.push(song);
        
            try {
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                await playing(para.bot, para.message.guild, queueContruct.songs[0]);
            } catch (err) {
                console.log(err);
                para.bot.queue.delete(para.message.guild.id);
                return channel.send(err);
            }
          } else {
            para.serverQueue.songs.push(song);
            return channel.send(`${author}-sama, Aqukin has queued: **${song.title}**`);
        }
    },
};

    
