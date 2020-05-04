/* This module allows the author to stop Aqukin current audio streaming and disconnect her from the voice channel */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class StopCommand extends BaseCommand{
    constructor() {super("stop", ["disconnect", "dc", "leave"], "Stop/Disconnect Aqukin audio stream", "CONNECT", "music", false, "")}

    async run (para) {
      const msg = para.message;
      const members = para.player.voiceChannel.members.filter(m => !m.user.bot);
      // checks if the author is alone with the bot or has administrative permission, if not return a message to inform them
      if(members.size > 1 && !msg.member.hasPermission("ADMINISTRATOR")) {return msg.channel.send(`**${msg.author.username}**-sama, you neeed to either be alone with Aqukin or has Administrative permission to use this command!`, para.ridingAqua)}
      const { id } = para.message.guild;
      para.bot.music.players.destroy(id);
    } // end of run
}; // end of module.exports


    
