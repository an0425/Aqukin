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

} // end of module.exports