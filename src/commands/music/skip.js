/* This module allows the author to skip an audio in Aqukin current audio streaming */
const { MessageEmbed } = require('discord.js');
const BaseCommand = require("../../utils/structures/BaseCommand");

let USED = false; // default the command recently used check to false

module.exports = class SkipCommand extends BaseCommand{
    constructor() {super("skip",["next", "nxt", "s", "n"], "CONNECT", "music", false, "")}
    
    async run (para) {
        // shortcut variables
        const author = para.message.author.username;
        const message = para.message;
        const player = para.player;
        const members = player.voiceChannel.members.filter(m => !m.user.bot);
 
        if (members.size === 1 || message.author.hasPermmission("ADMINISTRATOR")) { // checks if there's only one member in the voice channel, except bots of course or if the author has administrative permission
          player.stop();
          message.channel.send(`**${author}**-sama, Aqukin will now skip -> **${player.queue[0].title}**`);
        } 
        else { // else there's at least two or more members in the voice channel
          ++para.bot.music.skipCount; // increase the skip count
          para.bot.music.skippers.set(message.author.id, message.author) // the author has now voted to skip via command
          const votesRequired = Math.ceil(members.size * .6) - para.bot.music.skipCount;
          let reactionVotes = 0;
          if(votesRequired > 0){
            
            // contruct and send an embed asking the members to vote for skipping
            const embed = new MessageEmbed()
              .setDescription(`**${author}**-sama, Aqukin require \`${votesRequired}\` more vote(s) to skip`);
            const msg = await message.channel.send(embed);
            await msg.react("👍");
            await msg.react("👎");

            const filter = (reaction, user) => { // members reactions filter
              if (user.bot) return false; // exclude bot
              if (para.bot.music.skippers.has(user.id)){ // checks if the user has already voted to skip
                message.channel.send(`**${user.username}**-sama, you has voted to skip, please wait for others to vote`);
                return false;
              }
              const { channel } = message.guild.members.cache.get(user.id).voice;
              if (!channel) return false;
              if (channel.id === player.voiceChannel.id) {  // checks if the voters are in the same voice channel with Aqukin
                message.channel.send(`**${user.username}**-sama, Aqukin has acknowledge your vote to skip`);
                para.bot.music.skippers.set(user.id, user); // the user has now voted to skip via emote reation
                return ["👍"].includes(reaction.emoji.name); 
              }
              return false;
            }
            // allow 12s for skip command reaction
            const reactions = await msg.awaitReactions(filter, { max: votesRequired, time: 12000, errors: ['time'] });
            reactionVotes = reactions.get("👍").users.cache.filter(u => !u.bot);
            para.bot.music.skipCount += reactionVotes; // register the reactions count into the skip count
            msg.delete(); 
          }
          
          try { 
              message.channel.send(`**${author}**-sama, Aqukin will now skip -> **${player.queue[0].title}**`);
              player.stop();
          } catch (err) { // catch any errors
            console.log(err);
            para.bot.music.skipCount = 0; // in this case the command has not been recently used as it failed to execute
          }
        } // end of else
    } // end of run
}; // end of module.exports




    
