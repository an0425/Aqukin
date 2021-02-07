/* This module toggles the bot's ability to react */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ToggleReactionCommand extends BaseCommand{
    constructor() {super("togglereact", ["tr", "react"], "Toggle enabling/disabling the reaction module which allow Aqukin to react to messages with your server custom emojis", "ADMINISTRATOR", "settings", false, "", "-- will enable/disable Aqukin's ability to react to messages")}
    
    async run(para){
        // shortcut variables
        const { message, bot, settings } = para;

        if(await message.guild.emojis.cache.size <= 0){
            return message.channel.send(`**${message.author.username}**-sama, your server need to have \`custom emojis\` for ${bot.user.username} to react (； ￣Д￣)`);
        }

        settings.react = !settings.react;
        await settings.save();

        let reply = settings.react ? `will now \`enable\` the \`reaction module\` (ﾉ ◕ ヮ ◕) ﾉ *: ･ ﾟ ✧` : `has \`disabled\` the \`reaction module\` (* ￣ ▽ ￣) b`;

        message.channel.send(`**${message.author.username}**-sama, ${bot.user.username} ${reply}`);
    } // end of run
}; // end of module.exports


