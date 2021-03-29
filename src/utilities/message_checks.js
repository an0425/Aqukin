/* This module handles all the checking for the "message" event */
const { reply } = require("../utilities/artificial_intelligence/communication");
const { formatLength } = require("../utilities/functions");
const ridingAqua = { files: ["https://media1.tenor.com/images/e6578328df71dbd6b44318553e06eda8/tenor.gif?itemid=17267168"] };

// This function checks if the user is spamming commands
async function spamCheck(bot, message){
    // shortcut variables
    const { trackingList, deltaList } = bot.antispam;
    const { author } = message;
    const deltaMinThreshold = 10000;
    const minThreshold = 1500;
    const blockTime = 120000;

    // check for automated spamming
    if(!deltaList.has(author.id)){
        let deltaMsg = {
            lastMsgTime : message.createdTimestamp,
            deltas : [],
            lastDeltaStd : 0
        }

        deltaMsg.fn = setTimeout(() => { 
            deltaList.delete(author.id); 
        }, deltaMinThreshold); 
        await deltaList.set(author.id, deltaMsg);
    }

    else{
        const deltaMsg = await deltaList.get(author.id);
        
        if(deltaMsg.automatedSpamming)
            return true;

        else if(deltaMsg.lastDeltaStd < 80){
            clearTimeout(deltaMsg.fn);

            if(deltaMsg.deltas.length < 4){
                //console.log(`old ${deltaMsg.lastDeltaStd}`);

                await deltaMsg.deltas.push(message.createdTimestamp - deltaMsg.lastMsgTime);
                deltaMsg.lastMsgTime = message.createdTimestamp;
    
                deltaMsg.lastDeltaStd = await deltaMsg.deltas.standardDeviation();

                //console.log(`new ${deltaMsg.lastDeltaStd}`);
    
                deltaMsg.fn = setTimeout(() => { 
                    deltaList.delete(author.id); 
                }, deltaMinThreshold); 
            }

            else if(!deltaMsg.automatedSpamming){                
                deltaMsg.automatedSpamming = true;

                const deltaBlockTime = blockTime * 30;
                message.channel.send(`**${author.username}**-sama, ${bot.user.username} will now see you as a bot and won't take anymore commands from you for \`${formatLength(deltaBlockTime)}\``, ridingAqua);
                
                deltaMsg.fn = setTimeout(() => { 
                    deltaList.delete(author.id); 
                }, deltaBlockTime); 
            }

            await deltaList.set(author.id, deltaMsg);
        }
    }

    // checks for manual spamming
    if(!trackingList.has(author.id)){
        let userData = {
            warned : 0,
            blocked : false,
        }
        userData.fn = setTimeout(() => { 
            trackingList.delete(author.id); 
        }, minThreshold); 

        trackingList.set( author.id, userData );
        return false;
    }
    
    else{
        const userData = trackingList.get(author.id);
        // warn
        if(userData.warned < 3){
            clearTimeout(userData.fn);
            
            message.channel.send(`**${message.author.username}**-sama, you are rushing ${bot.user.username} hard, please be patient ＼(º □ º l|l)/`);
            userData.warned++;
            
            userData.fn = setTimeout(() => { 
                trackingList.delete(author.id); 
            }, minThreshold); 

            trackingList.set( author.id, userData );
        }
        // block
        else if(!userData.blocked){
            clearTimeout(userData.fn);
                
            message.channel.send(`**${author.username}**-sama, ${bot.user.username} won't take anymore commands from you for \`${formatLength(blockTime)}\``, ridingAqua);
            userData.blocked = true;

            userData.fn = setTimeout(() => { 
                trackingList.delete(author.id); 
            }, blockTime); 

            trackingList.set( author.id, userData );
        }
        return true;
    }
} // end of spamCheck(...) function

// this function checks for message type, return true if it's a command, return false if it's not
async function typeCheck(bot, message, prefix, tag){
    // checks if the message is not a command type
    if(!message.content.startsWith(prefix) && !message.content.startsWith(tag))  { 
        return false;
    }

    await bot.mentionCmd.mentioned.set(message.guild.id, message.content.startsWith(tag));
    return true;
} // end of typeCheck(...) function

// this function handles the all the checks for the commands
async function commandCheck(bot, message, command, args, settings, prefix, enableReply){
    // checks if the command is valid
    if (!command) {
        //console.log(message.content, args);
        if(enableReply) { 
            /* anti spam */
            if(await spamCheck(bot, message)) { 
                return;
            }
            await reply(message, args, prefix, bot.mentionCmd.tag); 
        }
        return; 
    }

    /* anti spam */
    if(await spamCheck(bot, message)) { 
        return;
    }

    await args.shift();

    // exclude onwer commands
    const { owner } = await bot.fetchApplication();
    if(command.tag == "owner" && message.author.id !== owner.id) { return; }

    // checks if the author has the permission to use the command, if not return a message to inform them
    if (!message.member.hasPermission(command.permission) && message.author.id !== owner.id) {
        message.channel.send(`I'm sorry **${message.author.username}**-sama, but it seems like you don't have the permission to use this command (っ ´ω\`) ﾉ (╥ω╥)`, ridingAqua);
        return;
    }

    // checks if the command require and argument and whether the user has provided it
    if(command.args && !args.length){
        let reply = `**${message.author.username}**-sama, please provide an \`argument\` for this command (＃ ￣ω￣)`; // default reply without usage
        // checks if there's a correct usage for the command
        reply += `\nThe proper usage would be \`${prefix}${command.name} ${command.usage}\``; // add the usage to the reply
        reply += command.usageEx ? `\nExample: ${prefix}${command.name} ${command.usageEx}` : ``; // add the usage example to the reply
        message.channel.send(reply); // return the reply to inform the author
        return;
    }

    // This variable stores the neccessary parameters for a commands
    let para = { 
        bot: bot,
        command: command,
        message: message,
        args: args,
        prefix: prefix,
        ridingAqua: ridingAqua
    }

    // Switch case for different command types checking
    switch(command.tag){
        // neccessary checks for music commands
        case "music": 
            const player = bot.music.lavalink ? await bot.music.players.find(player => player.guild === message.guild.id) : await bot.music.get(message.guild.id);
            const { channel }  = message.member.voice;
           
            // checks if the author is in a voice channel, if not return a message to inform them
            if(!channel) { 
                message.channel.send(`**${message.author.username}**-sama, you need to be in a voice channel to use this command (－‸ლ)`, ridingAqua);
                return; 
            }
            
            // checks if a player is already exist
            if (player) { 
                // checks if the bot in a voice channel and the author is also in that voice channel, if not return a message to inform them
                if((bot.music.lavalink ? player.voiceChannel : player.connection.channel.id) !== channel.id){
                    message.channel.send(`**${message.author.username}**-sama, you need to be in the same voice channel with ${bot.user.username} to use this command (╯ ° □ °) ╯ ┻━━┻`, ridingAqua);
                    return;    
                }

                // checks if the player is moving, opus only
                if(!bot.music.lavalink && player.queue[0].seek && command.name !== "disconnect"){
                    message.channel.send(`**${message.author.username}**-sama, ${bot.user.username} is still in the process of moving, please refrain from using any music commands in the mean time (╯︵╰,)`, ridingAqua);
                    return;
                }
            }

            // else no player is spawned yet thus checks if the command is play 
            else if(command.name !== "play") { 
                message.channel.send(`**${message.author.username}**-sama, ${bot.user.username} is not currently streaming any audio (oT-T) 尸`, ridingAqua);
                return;
            }
            
            // music only variables
            para.player = player;
            para.voiceChannel = channel;
            break; // end of music case

        // neccessary checks for economy commands
        case "economy":
            if(!bot.currency.has(message.author.id) && command.name !== "addinvestor") {
                message.channel.send(`**${message.author.username}**-sama, you need to be an investor to use this command (｡ • ́︿ • ̀｡)`);
                return;
            }
            break; // end of economy case

        // neccessary checks for settings commands
        case "settings":
            para.settings = settings;

            if(command.patreonOnly && !para.settings.patreon) {
                message.channel.send(`**${message.author.username}**-sama, you need to be a patreon to use this command (｡ • ́︿ • ̀｡)`);
                return;
            }
            break; // end of settings case
    } // end of switch

    return para;
} // end of commandCheck(...) function

module.exports = { spamCheck, typeCheck, commandCheck };