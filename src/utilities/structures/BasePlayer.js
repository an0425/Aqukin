const { musicEmbed } = require("../embed_constructor");

module.exports = class BasePlayer{
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

    /*
    async play(bot, ytdl){
        //console.log(this);
        let track = this.queue[0];
        // checks if the queue is empty
        if (!track) {
            // repeat the queue if queueRepeat is set to true
            if(this.queueRepeat){
                this.queue = this.queue.concat(this.loopqueue);
                this.loopqueue.splice(0);
                track = this.queue[0];
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
                
        // else the queue is not empty, setup the neccessary events for the dispatcher
        let ytdlOptions = { filter: "audio", formatFallback: "filtered" };
        let dispatcherOptions = { volume: this.volume ? this.volume : 1 };
        if(track.duration > 600){
            ytdlOptions.begin = track.seek ? track.seek*1000 : 0;
        }
        else{
            dispatcherOptions.seek = track.seek ? track.seek : 0;
        }
        
        // VoiceBroadcast events
        const dispatcher = this.connection.play(ytdl(track.url, ytdlOptions), dispatcherOptions)
            .on("error", async (err) =>{
                await this.textChannel.send(`**${this.queue[0].requester.username}**-sama, \`${err}\` has occured when ${bot.user.username} was trying to play track \`${track.title}\` 。 ゜ ゜ (´Ｏ\`) ゜ ゜。`);
            })
    
            .on("start", async () =>{
                // now playing embed constructing and sending
                this.seeking = false;
                const embed = await musicEmbed(bot, this, track);
                // send the embed to inform about the now playing track
                this.sentMessage = await this.textChannel.send(embed).catch(err => console.log("an error has occurered trying to send the embed", err));
            })
            
            .on("finish", async () =>{
                await dispatcher.destroy();
            })
            .once("close", async () => {
                // loop status checks
                if(!this.seeking) {
                    await bot.votingSystem.delete(this.id);
                    if(this.trackRepeat) { this.queue.splice(1, 0, this.queue[0]); }
                    else if(this.queueRepeat) { this.loopqueue.push(this.queue[0]); }
                    if(this.queue[0]) { this.queue[0].seek = 0; }
                }
    
                await this.queue.shift();
                await this.play(bot, ytdl);
                await this.sentMessage.delete().catch(err => console.log(err)); // try catch in case the message got deleted manually
            });
    
        // VoiceConnection events
        this.connection.on("error", async (err) =>{
            await this.textChannel.send(`**${author.username}**-sama, \`${err}\` 。 ゜ ゜ (´Ｏ\`) ゜ ゜。`);
            await bot.music.delete(this.id);
        })
    
        .once("disconnect", async () =>{
            this.queue.splice(0);
            if(this.connection.dispatcher){ await this.connection.dispatcher.end(); }
            await bot.votingSystem.delete(this.id);
            await bot.music.delete(this.id);
        });
    } // end of play(...) function */
} // end of module.exports