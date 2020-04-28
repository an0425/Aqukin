/* This module allows the author to skip an audio in Aqukin current audio streaming */
const { MessageEmbed } = require('discord.js');
const BaseCommand = require("../../utils/structures/BaseCommand");

let USED = false;

module.exports = class SkipCommand extends BaseCommand{
    constructor() {super("skip",["next", "nxt", "s", "n"], "CONNECT", "music", false, false, "")}
    
    async run (para) {
        // shortcut variables
        const author = para.message.author.username;
        const msg = para.message;
        const { channel } = msg.member.voice
        const members = channel.members.filter(m => !m.user.bot);
        const player = para.bot.music.players.get(msg.guild);
        
        if (members.size === 1) {
          player.stop();
          msg.channel.send(`**${author}**-sama, Aqukin will now skip -> **${player.queue[0].title}**`);
        } else {
          if (!USED) {
            USED = true;
            const votesRequired = Math.ceil(members.size * .6);
            const embed = new MessageEmbed()
              .setDescription(`**${author}**-sama, Aqukin will skip if the total votes reached -> ${votesRequired}`);
            const msg = await msg.channel.send(embed);
            await msg.react('👍');
            await msg.react('👎');

            const filter = (reaction, user) => {
              if (user.bot) return false;
              const { channel } = msg.guild.members.cache.get(user.id).voice;
              if (channel) {
                if (channel.id === player.voiceChannel.id) {
                  return ['👍'].includes(reaction.emoji.name);
                }
                return false;
              } else {
                return false;
              }
            }

            try {
              const reactions = await msg.awaitReactions(filter, { max: votesRequired, time: 10000, errors: ['time'] });
              const totalVotes = reactions.get('👍').users.cache.filter(u => !u.bot);
              if (totalVotes.size >= votesRequired) {
                player.stop();
                USED = false;
              }
            } catch (err) {
              console.log(err);
              USED = false;
            }
          } else {
            msg.channel.send(`**${author}**-sama, please refrain from using this command repeatedly!`);
          }
        }   
    }
};




    
