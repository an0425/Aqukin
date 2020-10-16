/* This module allow the admin of a guild to set a text channel as the announcement channel */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class SetChannelCommand extends BaseCommand{
    constructor() {super("setchannel", ["sc", "announcement", "channel"], "Set a text channel as an announcement channel", "ADMINISTRATOR", "settings", true, "<text channel id>", "123456789 -- will change the bot's current announcement channel to with the id `123456789`")}
    
    async run(para){
        // shortcut variables
        const { message, bot, settings } = para;

        const channel = await message.channel.guild.channels.cache.get(para.args[0]);

        // check if the channel doesn't exists
        if(!channel){
            message.channel.send(`**${message.author.username}**-sama, ${bot.user.username} can't find any text channel with id \`${para.args[0]}\` (╥﹏╥)`);
        }
        // else check if the channel is a text channel
        else if(channel.type !== "text"){
            message.channel.send(`**${message.author.username}**-sama, \`${channel.name}\` is not a **text channel** (눈 _ 눈)`);
        }
        else{
            settings.announcement_ch = channel.id;
            await settings.save();
            message.channel.send(`**${message.author.username}**-sama, ${bot.user.username} has set \`${channel.name}\` as the annoucement channel (* ≧ ω ≦ *)`);
        }
    } // end of run
}; // end of module.exports

