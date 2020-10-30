/* this module represents the "emojiCreate" event */
const BaseEvent = require("../utilities/structures/BaseEvent");

module.exports = class EmojiCreateEvent extends BaseEvent {
    constructor() { super("emojiCreate"); }
    
    async run(bot, emoji){
        const {id, guild} = emoji;

        const settings  = await bot.settings.get(guild.id);
        
        if(settings.react){
            await emojis.push(id);
            settings.save();
        }
    } // end of run
} // end of module.exports
