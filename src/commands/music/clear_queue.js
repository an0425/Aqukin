/* This module allows the author to clear the music queue */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ClearQueueCommand extends BaseCommand {
  constructor () {super("clear", [], "Clear the music queue", "CONNECT", "music", false, "");}

  async run (para) {
    // shortcut variables
    const msg = para.message;
    const player = para.player;
    const members = para.player.voiceChannel.members.filter(m => !m.user.bot);
    
    // checks if the author is alone with the bot or has administrative permission, if not return a message to inform them
    if(members.size > 1 && !msg.member.hasPermission("ADMINISTRATOR")) {return msg.channel.send(`**${msg.author.username}**-sama, you neeed to either be **alone** with Aqukin or has **Administrative** permission to use this command!`, para.ridingAqua)}

    // checks if the current queue is empty, if so return a message to inform the author
    if(player.queue.empty) return msg.channel.send(`**${author}**-sama, the audio queue is currently empty~`, para.ridingAqua);
    player.queue.clear();
    msg.channel.send(`**${msg.author.username}**-sama, Aqukin has cleared the queue`);
  }
}