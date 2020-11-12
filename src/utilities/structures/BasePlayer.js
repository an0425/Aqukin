module.exports = class BasePlayer{
    constructor (bot, id, textChannel, voiceChannel){
        this.id = id,
        this.textChannel = textChannel,
        this.trackRepeat = false,
        this.queueRepeat = false,
        this.seeking = false,
        this.queue = [],
        this.loopqueue = []            

        bot.music.set(id, this);
    }
} // end of module.exports