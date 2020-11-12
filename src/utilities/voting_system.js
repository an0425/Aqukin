/* This module contruct the voting system for an command */
const { MessageEmbed, Collection } = require("discord.js");

async function voteConstruct (bot, message, player, command){
    // checks if the command require voting
    if(!bot.votingSystem.has(message.guild.id)){
        await bot.votingSystem.set(message.guild.id, new Collection())
    }

    voteCmds = await bot.votingSystem.get(message.guild.id);
    
    if(!voteCmds.has(command.name)){
        await voteCmds.set(command.name, {
            voteCount: 0,
            votesRequired: 0,
            voteReached: false,
            voters: new Collection(),
        });
    }

    let votingSysVar = await voteCmds.get(command.name); 

    // check if the author has already voted
    if(votingSysVar.voters.has(message.author.id)) {
        message.channel.send(`**${message.author.username}**-sama, ${bot.user.username} has already acknowledged your vote to \`${command.description}\`, please wait for other(s) to vote (ᗒᗣᗕ)՞`);
        return votingSysVar.voteReached;
    }

    const members = await message.guild.channels.cache.get(player.voiceChannel).members.filter(m => !m.user.bot);
    if(members.size === 1 || message.member.hasPermission("ADMINISTRATOR")){
        votingSysVar.voteReached = true;
    }
    // else there's at least two or more members in the voice channel
    else {
        ++votingSysVar.voteCount; // increase the vote count
        votingSysVar.voters.set(message.author.id, message.author) // the author has now voted via command
        votingSysVar.votesRequired = Math.ceil(members.size * 0.6);
        
        // Checks if more vote(s) is required
        if(votingSysVar.votesRequired > votingSysVar.voteCount){  
            // contruct and send an embed asking the members to vote
            const embed = new MessageEmbed()
                .setTitle(`Please react if you would also like to \`${command.description}\``)
                .setDescription(`${bot.user.username} require \`${votingSysVar.votesRequired}\` vote(s) to \`${command.description}\` (ｏ ・ _ ・) ノ ”(ノ _ <、)`)
                .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
           
            const msg = await message.channel.send(`**${message.author.username}**-sama, you have voted to \`${command.description}\`, please wait for other(s) to vote (= ω =) .. nyaa`, embed)
            await msg.react("⚓");
                
            // members reactions filter
            const filter = async (reaction, user) => {                    
                // checks if the voters are not bot, use the correct emojis, is in the same voice channel with the bot and has not voted
                if (!user.bot && ["⚓"].includes(reaction.emoji.name) && message.guild.members.cache.get(user.id).voice.channel.id === player.voiceChannel && !votingSysVar.voters.has(user.id)) {  
                    // checks if the voters has administrative permission
                    const memCheck = await message.guild.members.fetch(user.id);
                    if(memCheck.hasPermission("ADMINISTRATOR"))
                        votingSysVar.voteCount = votingSysVar.votesRequired;
                    else{
                        message.channel.send(`**${user.username}**-sama, ${bot.user.username} has acknowledge your vote to \`${command.description}\` (* ￣ ▽ ￣) b`);
                        await votingSysVar.voters.set(user.id, user); // the user has now voted via emote reation
                    }
                    return true;
                }
                return false;
            } // end of reaction filter
                
            const reactions = await msg.awaitReactions(filter, { max: votingSysVar.votesRequired-votingSysVar.voteCount, time: 24000 }).catch(console.error);
            
            // checks if the vote is reached after the reaction vote
            votingSysVar.voteCount += reactions.size;
            votingSysVar.voteReached = votingSysVar.voteCount >= votingSysVar.votesRequired; 
            msg.delete();
        } // end of if vote has not been reached
        
        // else the vote has been reached
        else { 
            votingSysVar.voteReached = true;
        }
    } // end of else there's at least two or more members in the voice channel

    if(votingSysVar.voteReached){
        if(voteCmds.has(command.name)){
            await voteCmds.delete(command.name);
        }
        else{
            votingSysVar.voteReached = false;
        }
    }

    return votingSysVar.voteReached;
}

module.exports = { voteConstruct }