/* This module toggles the bot's ability to react */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ToggleReactionCommand extends BaseCommand{
    constructor() {super("togglereact", ["tr", "react"], "Toggle enabling/disabling the reaction module which allow Aqukin to react to messages with your server custom emojis", "ADMINISTRATOR", "settings", false, "", "-- will enable/disable Aqukin's ability to react to messages")}
    
    async run(para){
        // shortcut variables
        const { message, bot, settings } = para;

        const emojiList = Array.from(message.guild.emojis.cache.map(e => e.id.toString()));

        if(emojiList.length === 0){
            return message.channel.send(`**${message.author.username}**-sama, you need to have custom emojis so ${bot.user.username} can react (； ￣Д￣)`);
        }

        settings.react = !settings.react;
        await settings.save();

        let reply = "";

        if(!settings.react){ 
            settings.emojis = [];
            await settings.save();
            reply += `${bot.user.username} has \`disabled\` the \`reaction module\` (* ￣ ▽ ￣) b`;
        }
        else{ 
            settings.emojis = emojiList;
            await settings.save();
            reply += `${bot.user.username} will now \`enable\` the \`reaction module\` (ﾉ ◕ ヮ ◕) ﾉ *: ･ ﾟ ✧`; 
        }

        message.channel.send(`**${message.author.username}**-sama, ${reply}`);
    } // end of run
}; // end of module.exports

