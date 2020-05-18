/* this module handles all the checking for the "message" event */
const { MessageAttachment, MessageEmbed} = require("discord.js")
const {Collection} = require("discord.js");
const ridingAqua = new MessageAttachment("./src/pictures/riding.gif");

// this function checks for message type, return true if it's a command, return false if it's not
async function typeCheck(message, prefix){
    // checks if the message is not a command
    if(!message.content.startsWith(prefix)){return false;} // return false
    else return true;
} // end of typeCheck(...) function

// this function handles the all the checks for the commands
async function commandCheck(bot, message, command, args, prefix){
    // checks if the command is valid
    if (!command) {
        message.channel.send(`**${message.author.username}**-sama, Aqukin can't find any command with that name, try \`>help\` if you need help with commands~`, ridingAqua);
        return; 
    }

    // checks if the command require and argument and whether the user has provided it
    if(command.args && !args.length){
        let reply = `**${message.author.username}**-sama, please provide an argument for this command.`; // default reply without usage
        // checks if there's a correct usage for the command
        if(command.usage) { reply += `\nThe proper usage would be \`${prefix}${command.name} ${command.usage}\``;} // add the usage to the reply
        message.channel.send(reply); // return the reply to inform the author
        return;
    }

    // checks if the author has the permission to use the command, if not return a message to inform them
    if (!message.member.hasPermission(command.permission)) {
        message.channel.send(`I'm sorry **${message.author.username}**-sama, but it seems like you don't have the permission to use this command`, ridingAqua);
        return;
    }

    let para;
    switch(command.tag){
        // checks if the command is a music command
        case "music": // neccessary checks for music commands 
            const { id } = message.guild;
            const player = bot.music.players.get(id);
            const { channel }  = message.member.voice;
            // checks if the author is in a voice channel, if not return a message to inform them
            if(!channel) { 
                message.channel.send(`**${message.author.username}**-sama, you need to be in a voice channel to use this command`, ridingAqua);
                return; 
            }
            // checks if Aqukin in a voice channel and the author is also in that voice channel, if not return a message to inform them
            if (player && player.voiceChannel.id !== channel.id) { 
                message.channel.send(`**${message.author.username}**-sama, you need to be in the same voice channel with Aqukin to use this command`, ridingAqua);
                return;
            }
            // checks if Aqukin is streaming any audio, excluding the play/multiplay commands, if not return a message to inform the author
            if(!player && command.name !== "play" && command.name !== "multiplay") { 
                message.channel.send(`**${message.author.username}**-sama, Aqukin is not currently streaming any audio`, ridingAqua)
                return;
            }; 
            // checks if the command require voting
            let voteReached = false;
            if(command.votable) {
                if(!bot.music.votingSystem.has(command.name)){
                    bot.music.votingSystem.set(command.name, {
                        voteCount: 0,
                        voters: new Collection(),
                        votesRequired: 0,
                    });
                }
                let votingSysVar = bot.music.votingSystem.get(command.name); 
                const members = player.voiceChannel.members.filter(m => !m.user.bot);

                // check if the author has already voted to skip
                if(votingSysVar.voters.has(message.author.id)) {
                    message.channel.send(`**${message.author.username}**-sama, you has voted to \`${command.name}\`, please wait for other(s) to vote`);
                    return;
                }

                // checks if there's only one member in the voice channel, except bots of course or if the author has administrative permission
                if (members.size === 1 || message.member.hasPermission("ADMINISTRATOR")) {
                    voteReached = true;
                    bot.music.votingSystem.delete(command.name);
                } 
                // else there's at least two or more members in the voice channel
                else {
                    ++votingSysVar.voteCount; // increase the vote count
                    votingSysVar.voters.set(message.author.id, message.author) // the author has now voted to skip via command
                    votingSysVar.votesRequired = Math.ceil(members.size * .6) - votingSysVar.voteCount;
                    if(votingSysVar.votesRequired > 0){  
                        // contruct and send an embed asking the members to vote for skipping
                        const embed = new MessageEmbed()
                            .setTitle(`Please react if you would also like to \`${command.name}\``)
                            .setDescription(`**${message.author}**-sama, Aqukin require \`${votingSysVar.votesRequired}\` more vote(s) to \`${command.name}\`~`)
                            .setFooter("Vive La Résistance le Hololive~");
                        const msg = await message.channel.send(embed);
                        await msg.react("🆗");

                        const filter = (reaction, user) => { // members reactions filter
                            if (user.bot) return false; // exclude bot
                            if (votingSysVar.voters.has(user.id)){ // checks if the user has already voted to skip
                                message.channel.send(`**${user.username}**-sama, you has voted to \`${command.name}\`, please wait for other(s) to vote~`);
                                return false;
                            }
                            const memPermissionCheck = message.guild.members.cache.get(user.id);
                            const { channel } = message.guild.members.cache.get(user.id).voice;
                            if (!channel) return false;
                            if (channel.id === player.voiceChannel.id) {  // checks if the voters are in the same voice channel with Aqukin
                                if(memPermissionCheck.hasPermission("ADMINISTRATOR")){
                                    voteReached = true;
                                    return ["🆗"].includes(reaction.emoji.name); 
                                }
                                else{
                                    message.channel.send(`**${user.username}**-sama, Aqukin has acknowledge your vote to skip~`);
                                    votingSysVar.voters.set(user.id, user); // the user has now voted to skip via emote reation
                                    return ["🆗"].includes(reaction.emoji.name); 
                                }
                            }
                            return false;
                        } // end of reaction filter
                        // allow 12s for skip command reaction
                        try{
                            const reactions = await msg.awaitReactions(filter, { max: votingSysVar.votesRequired, time: 12000, errors: ["time"] })
                            if(reactions){
                                const reactionVotes = reactions.get("🆗").users.cache.filter(u => !u.bot);
                                votingSysVar.voteCount += reactionVotes.size; // register the reactions count into the skip count
                            
                                if(votingSysVar.votesRequired > 0){ // check after the reaction vote
                                    voteReached = true;
                                    bot.music.votingSystem.delete(command.name);
                                }
                            }
                        } catch(err) {console.log(err);} 
                        msg.delete({ timeout: 12000 });
                    } // end of if voteRequire is > 0
                    else {
                        voteReached = true;
                        bot.music.votingSystem.delete(command.name);
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
                channel: channel,
                voteReached: voteReached
            }
            break; // end of music case

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

module.exports = {typeCheck, commandCheck};