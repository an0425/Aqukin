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

    votingSysVar = await voteCmds.get(command.name); 

    // check if the author has already voted
    if(votingSysVar.voters.has(message.author.id)) {
        message.channel.send(`**${message.author.username}**-sama, Aqukin has already acknowledged your vote to \`${command.description}\`, please wait for other(s) to vote _(ˇωˇ」∠)\\_`);
        return votingSysVar.voteReached;
    }

    const members = player.connection.channel.members.filter(m => !m.user.bot);
    // members.size === 1 || message.member.hasPermission("ADMINISTRATOR")
    if(members.size > 1){
        if(votingSysVar) { voteCmds.delete(command.name); }
        votingSysVar.voteReached = true;
    }
    // else there's at least two or more members in the voice channel
    else {
        ++votingSysVar.voteCount; // increase the vote count
        votingSysVar.voters.set(message.author.id, message.author) // the author has now voted via command
        votingSysVar.votesRequired = Math.ceil(members.size * 2) - votingSysVar.voteCount;
        if(votingSysVar.votesRequired > 0){  
            // contruct and send an embed asking the members to vote
            const embed = new MessageEmbed()
                .setTitle(`Please react if you would also like to \`${command.description}\``)
                .setDescription(`Aqukin require \`${votingSysVar.votesRequired}\` more vote(s) to \`${command.description}\` (\`･ω･´)`)
                .setFooter("Vive La Résistance le Hololive~");
            const msg = await message.channel.send(`**${message.author.username}**-sama, Aqukin has acknowledged your vote to \`${command.description}\`, please wait for other(s) to vote ( ˊᵕˋ)ﾉˊᵕˋ)`, embed);
            await msg.react("⚓");

            const filter = (reaction, user) => { // members reactions filter
                if (user.bot) { return false; } // exclude bot
                /*if (votingSysVar.voters.has(user.id)){ // checks if the user has already voted
                    message.channel.send(`**${user.username}**-sama, Aqukin has already acknowledged your vote to \`${command.description}\`, please wait for other(s) to vote _(ˇωˇ」∠)\\_`);
                    return false;
                } */
                const memPermissionCheck = message.guild.members.cache.get(user.id);
                const { channel } = message.guild.members.cache.get(user.id).voice;
                if (!channel) { return false; }
                if (channel.id === player.connection.channel.id) {  // checks if the voters are in the same voice channel with Aqukin
                    if(memPermissionCheck.hasPermission("ADMINISTRATOR")){
                        votingSysVar.voteReached = true;
                        return ["⚓"].includes(reaction.emoji.name); 
                    }
                    else{
                        message.channel.send(`**${user.username}**-sama, Aqukin has acknowledge your vote to \`${command.description}\` ( ˊᵕˋ)ﾉˊᵕˋ)`);
                        votingSysVar.voters.set(user.id, user); // the user has now voted via emote reation
                        return ["⚓"].includes(reaction.emoji.name); 
                    }
                }
                return false;
            } // end of reaction filter
            // allow 12s for reaction vote
            try{
                const reactions = await msg.awaitReactions(filter, { max: votingSysVar.votesRequired, time: 24000, errors: ["time"] })
                if(reactions){
                    const reactionVotes = await reactions.get("⚓").users.cache.filter(u => !u.bot);
                    votingSysVar.voteCount += reactionVotes.size; // register the reactions count into the vote count
                
                    // checks after the reaction vote
                    if(votingSysVar.votesRequired > 0){ 
                        if(votingSysVar) { await voteCmds.delete(command.name); }
                        votingSysVar.voteReached = true; 
                    }
                }
            } catch(err) {
                console.log(err);
            } 
            msg.delete();
        } // end of if voteRequire is > 0
        else { // else the vote has been reached
            if(votingSysVar) { await voteCmds.delete(command.name); }
            votingSysVar.voteReached = true;
        }
    } // end of else there's at least two or more members in the voice channel
    return votingSysVar.voteReached;
}

module.exports = { voteConstruct }