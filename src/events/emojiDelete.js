/* this module represents the "emojiDelete" event */
const BaseEvent = require("../utilities/structures/BaseEvent");

module.exports = class EmojiDeleteEvent extends BaseEvent {
    constructor() { super("emojiDelete"); }
    
    async run(bot, emoji){
        const {id, guild} = emoji;

        const settings  = await bot.settings.get(guild.id);

        if(settings.react){
            await settings.emojis.splice(await emojis.indexOf(id), 1);
            settings.save();
        }
    } // end of run
} // end of module.exports
