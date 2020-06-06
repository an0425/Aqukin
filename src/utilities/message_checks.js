/* this module handles all the checking for the "message" event */
const { MessageEmbed } = require("discord.js");
const { Collection } = require("discord.js");
//const ridingAqua = new MessageAttachment("./src/pictures/riding.gif");
const ridingAqua = {files: ["https://media1.tenor.com/images/e6578328df71dbd6b44318553e06eda8/tenor.gif?itemid=17267168"]};

// this function checks for message type, return true if it's a command, return false if it's not
async function typeCheck(bot, message, prefix, tag){
    // checks if the message is a command type
    if(message.content.startsWith(prefix))  { return true; }
    else if(message.content.startsWith(tag)){
        await bot.mentionCmd.mentioned.set(message.guild.id, true);
        return true;
    }
    else{ return false; } // return false
} // end of typeCheck(...) function

// this function handles the all the checks for the commands
async function commandCheck(bot, message, command, args, prefix){
    // checks if the command is valid
    if (!command) {
        message.channel.send(`**${message.author.username}**-sama, Aqukin can't find any command with that name, try \`${prefix}help\` if you need help with commands _(ˇωˇ」∠)\\_`, ridingAqua);
        return; 
    }

    // checks if the command require and argument and whether the user has provided it
    if(command.args && !args.length){
        let reply = `**${message.author.username}**-sama, please provide an argument for this command _(ˇωˇ」∠)\\_`; // default reply without usage
        // checks if there's a correct usage for the command
        if(command.usage) { reply += `\nThe proper usage would be \`${prefix}${command.name} ${command.usage}\``; } // add the usage to the reply
        if(command.usageEx) { reply += `\nExample: ${prefix}${command.name} ${command.usageEx}`; } // add the usage example to the reply
        message.channel.send(reply); // return the reply to inform the author
        return;
    }

    // checks if the author has the permission to use the command, if not return a message to inform them
    if (!message.member.hasPermission(command.permission)) {
        message.channel.send(`I'm sorry **${message.author.username}**-sama, but it seems like you don't have the permission to use this command (´-﹃-\`)`, ridingAqua);
        return;
    }

    let para;
    switch(command.tag){
        // checks if the command is a music command
        case "music": // neccessary checks for music commands 
            const player = await bot.music.get(message.guild.id);
            const { channel }  = message.member.voice;
            // checks if the author is in a voice channel, if not return a message to inform them
            if(!channel) { 
                message.channel.send(`**${message.author.username}**-sama, you need to be in a voice channel to use this command (´-﹃-\`)`, ridingAqua);
                return; 
            }
            // checks if Aqukin in a voice channel and the author is also in that voice channel, if not return a message to inform them
            if (player && player.connection.channel.id !== channel.id) { 
                message.channel.send(`**${message.author.username}**-sama, you need to be in the same voice channel with Aqukin to use this command (´-﹃-\`)`, ridingAqua);
                return;
            }
            // checks if Aqukin is streaming any audio, excluding the play/multiplay commands, if not return a message to inform the author
            if(!player && command.name !== "play") { 
                message.channel.send(`**${message.author.username}**-sama, Aqukin is not currently streaming any audio (´-﹃-\`)`, ridingAqua);
                return;
            };
             
            // checks if the command require voting
            let votingSysVar;
            let voteCmds;
            if(command.votable) {
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
                    return;
                }

                const members = player.connection.channel.members.filter(m => !m.user.bot);
                if(members.size === 1 || message.member.hasPermission("ADMINISTRATOR")){
                    if(votingSysVar) { voteCmds.delete(command.name); }
                    votingSysVar.voteReached = true;
                }
                // else there's at least two or more members in the voice channel
                else {
                    ++votingSysVar.voteCount; // increase the vote count
                    votingSysVar.voters.set(message.author.id, message.author) // the author has now voted via command
                    votingSysVar.votesRequired = Math.ceil(members.size * .6) - votingSysVar.voteCount;
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
                            if (votingSysVar.voters.has(user.id)){ // checks if the user has already voted
                                message.channel.send(`**${user.username}**-sama, Aqukin has already acknowledged your vote to \`${command.description}\`, please wait for other(s) to vote _(ˇωˇ」∠)\\_`);
                                return false;
                            } 
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
                                if(votingSysVar.votesRequired > 0){ votingSysVar.voteReached = true; }
                            }
                        } catch(err) {
                            console.log(err);
                        } 
                        msg.delete();
                    } // end of if voteRequire is > 0
                    else { // else the vote has been reached
                        votingSysVar.voteReached = true;
                    }
                } // end of else there's at least two or more members in the voice channel
            } // end of if the command require voting
            // construct a collection of all parameters to pass to a function to eliminate unused parameters
            para = {
                bot: bot,
                message: message,
                args: args,
                prefix: prefix,
                ridingAqua: ridingAqua,
                // music only parameters
                player: player,
                voiceChannel: channel,
            }
            if(votingSysVar){
                if(votingSysVar.voteReached) { para.voteReached = votingSysVar.voteReached; }
                voteCmds.delete(command.name);
            }
            break; // end of music case

        // a case for other economy commands
        case "economy":
            if(!bot.currency.has(message.author.id) && command.name !== "addinvestor") {
                message.channel.send(`**${message.author.username}**-sama, you need to be an investor to use this command (´-﹃-\`)`);
                return;
            }
            para = { // same collection but in this case only needed parameters
                bot: bot,
                message: message,
                args: args,
                prefix: prefix,
                ridingAqua: ridingAqua
            }
            break; // end of economy case

        // a default case for other type of commands
        default:
            para = { // same collection but in this case only needed parameters
                bot: bot,
                message: message,
                args: args,
                prefix: prefix,
                ridingAqua: ridingAqua
            }
            break; // end of default case
    } // end of switch
    return para;
} // end of commandCheck(...) function

module.exports = { typeCheck, commandCheck };