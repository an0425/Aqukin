/* this module represents the "guildMemberAdd" event */
const BaseEvent = require("../utilities/structures/BaseEvent");

module.exports = class GuildMemberAddEvent extends BaseEvent {
    constructor() {super("guildMemberAdd");}
    
    async run(bot, member){
        const channel = await member.guild.channels.cache.find(channel => channel.id === "623712955845836842");
        const admin = await bot.users.fetch("422435290054000640");
        // check if the channel exist
        if (!channel) return;
        // check if the user is a bot
        if(member.user.bot) return;
        channel.send(`Konaqua~ **${member.displayName}**-sama, My name is Minato Aqua your ninja combat maid, please wait for ${admin}-sama to specify your role(s), arigatou gozamatshita~.`);
    } // end of run
} // end of module.exports
