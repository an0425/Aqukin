/* This module toggles the bot's ability to randomly post twitter fan art feeds 
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ToggleTwitterArtCommand extends BaseCommand{
    constructor() {super("toggletwitterart", ["tta", "twitterart", "artfeed"], "Toggle enabling/disabling the twitter art feed module, allowing the bot to post 5 random twitter fan arts per 5 mins of your Hololive JP and EN oishi (requires an announcement channel to be set)", "ADMINISTRATOR", "settings", false, "", "-- will enable/disable Aqukin's ability to post random twitter art feeds")}
    
    async run(para){
        // shortcut variables
        const { message, bot, settings } = para;

        const channel = await message.channel.guild.channels.cache.get(settings.announcement_ch);

        if(channel){
            settings.artfeed = !settings.artfeed;
            await settings.save();
    
            let reply = settings.artfeed ? `${bot.user.username} will now \`enable\` the \`twitter art feed module\` (*´꒳\`\\*)` : `${bot.user.username} has \`disabled\` the \`twitter art feed module\` (* ￣ ▽ ￣) b`;
            message.channel.send(`**${message.author.username}**-sama, ${reply}`);
        }

        else{
            let reply;
            if(settings.announcement_ch){
                settings.announcement_ch = null;
                await settings.save();
                reply = "The previously set channel is no longer available ＼ (º □ º l | l) /";
            }

            else{
                reply = "You need to set an announcement channel first to enable this module (」° ロ °)」";
            }

            message.channel.send(`**${message.author.username}**-sama, ${reply} \nTo set a new announcement channel use the \`setchannel\` command. For the command list try the \`help\` command`);
        }
    } // end of run
}; // end of module.exports */

