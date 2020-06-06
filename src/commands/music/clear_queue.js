/* This module allows the author to clear the music queue */
const { musicEmbed } = require("../../utilities/embed_constructor");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ClearQueueCommand extends BaseCommand {
  constructor () {super("clearqueue", ["cq", "clrq", "clear"], "Clear the audio player's queue", "CONNECT", "music", false, true, "", "-- will clear the queue");}

  async run (para) {
    // shortcut variables
    const { message, player, voteReached } = para;
    if(!voteReached) { return; }
    const author = message.author.username;

    // checks if the current queue is empty, if so return a message to inform the author
    if(player.queue.length <= 1) { return message.channel.send(`**${author}**-sama, The queue is already cleared _(´ㅅ\`)⌒)\\_`); }
    await player.queue.splice(1);
    message.channel.send(`**${author}**-sama, Aqukin has cleared the queue (\`･ω･´)`);

    /* Update the currently playing embed */
    const embed = await musicEmbed(para.bot, player, player.queue[0])
    try{
      await player.sentMessage.edit(embed); // send the embed to inform about the now playing track
    } catch(err) {
      console.log("Recreating the deleted music embed", err);
      player.sentMessage = await player.textChannel.send(embed);
    } 
  } // end of run
} // end of module.exports