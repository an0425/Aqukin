/* this module represents the "guildMemberAdd" event */
const BaseEvent = require("../../utils/structures/BaseEvent");

module.exports = class GuildMemberAddEvent extends BaseEvent {
    constructor() {
        super("guildMemberAdd");
    }
    
    async run(){
        const channel = member.guild.chanels.find(channel => channel.name === "lobby");
        if (!channel) return;
        channel.send(`Konaqua~ ${member}-sama, My name is Minato Aqua your ninja combat maid, please wait for <@422435290054000640>-sama to specify your server role. 
                    If he is not available you can access the server by using the following command ">noticeMeSenpai", arigatou gozamatshita~.`);
    }
}
