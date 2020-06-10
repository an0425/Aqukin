/* This module handles all the checking for the "message" event */
const ridingAqua = {files: ["https://media1.tenor.com/images/e6578328df71dbd6b44318553e06eda8/tenor.gif?itemid=17267168"]};
//const ridingAqua = new MessageAttachment("./src/pictures/riding.gif");

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
        message.channel.send(`**${message.author.username}**-sama, Aqukin can't find any command with that name ლ (¯ ロ ¯ "ლ), try \`${prefix}help\` if you need help with commands`, ridingAqua);
        return; 
    }

    // checks if the author has the permission to use the command, if not return a message to inform them
    if (!message.member.hasPermission(command.permission)) {
        message.channel.send(`I'm sorry **${message.author.username}**-sama, but it seems like you don't have the permission to use this command (っ ´ω\`) ﾉ (╥ω╥)`, ridingAqua);
        return;
    }

    // checks if the command require and argument and whether the user has provided it
    if(command.args && !args.length){
        let reply = `**${message.author.username}**-sama, please provide an argument for this command (＃ ￣ω￣)`; // default reply without usage
        // checks if there's a correct usage for the command
        if(command.usage) { reply += `\nThe proper usage would be \`${prefix}${command.name} ${command.usage}\``; } // add the usage to the reply
        if(command.usageEx) { reply += `\nExample: ${prefix}${command.name} ${command.usageEx}`; } // add the usage example to the reply
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
            const player = await bot.music.get(message.guild.id);
            const { channel }  = message.member.voice;
            // checks if the author is in a voice channel, if not return a message to inform them
            if(!channel) { 
                message.channel.send(`**${message.author.username}**-sama, you need to be in a voice channel to use this command (－‸ლ)`, ridingAqua);
                return; 
            }
            // checks if Aqukin in a voice channel and the author is also in that voice channel, if not return a message to inform them
            if (player && player.connection.channel.id !== channel.id) { 
                message.channel.send(`**${message.author.username}**-sama, you need to be in the same voice channel with Aqukin to use this command (╯ ° □ °) ╯ ┻━━┻`, ridingAqua);
                return;
            }
            // checks if Aqukin is streaming any audio, excluding the play/multiplay commands, if not return a message to inform the author
            if(!player && command.name !== "play") { 
                message.channel.send(`**${message.author.username}**-sama, Aqukin is not currently streaming any audio (oT-T) 尸`, ridingAqua);
                return;
            }
            // checks if the player is moving
            if(player && player.seeking && command.name !== "disconnect"){
                message.channel.send(`**${message.author.username}**-sama, Aqukin is still in the process of moving, please refrain from using any music commands in the mean time (╯︵╰,)`, ridingAqua);
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
    } // end of switch

    return para;
} // end of commandCheck(...) function

module.exports = { typeCheck, commandCheck };