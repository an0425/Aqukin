/* this module handles all the checking for the "message" event */
const { MessageAttachment } = require("discord.js")
const ridingAqua = new MessageAttachment("./src/pictures/riding.gif");

// this function checks for message type, return true if it's a command, return false if it's not
async function typeCheck(message, prefix){
    // checks if the message is not a command
    if(!message.content.startsWith(prefix)){return false;} // return false
    else return true;
} // end of

// this function handles the all the checks for the commands
async function commandCheck(bot, message, command, args, prefix){
    if (!command) return; // checks if the command is valid, if not return

    // checks if the command require and argument and whether the user has provided it
    if(command.args && !args.length){
        let reply = `**${message.author.username}**-sama, please provide an argument for this command.`; // default reply without usage
        // checks if there's a correct usage for the command
        if(command.usage) { reply += `\nThe proper usage would be \`${prefix}${command.name} ${command.usage}\``;} // add the usage to the reply
        return message.channel.send(reply); // return the reply to inform the author
    }

    // checks if the author has the permission to use the command, if not return a message to inform them
    if (!message.member.hasPermission(command.permission)) return message.channel.send(`I'm sorry **${message.author.username}**-sama, but it seems like you don't have the permission to use this command :(`);

    let para;
    switch(command.tag){
        // checks if the command is a music command
        case "music": // neccessary checks for music commands 
            const { id } = message.guild;
            const player = bot.music.players.get(id);
            const { channel }  = message.member.voice;
            // checks if the author is in a voice channel, if not return a message to inform them
            if(!channel) return message.channel.send(`**${message.author.username}**-sama, you need to be in a voice channel to use this command`, ridingAqua);
            // checks if Aqukin in a voice channel and the author is also in that voice channel, if not return a message to inform them
            if (player && player.voiceChannel.id !== channel.id) { return message.channel.send(`**${message.author.username}**-sama, you need to be in the same voice channel with Aqukin to use this command`, ridingAqua);}
            // checks if Aqukin is streaming any audio, excluding the play/multiplay commands, if not return a message to inform the author
            if(!player && command.name !== "play" && command.name !== "multiplay") return message.channel.send(`**${message.author.username}**-sama, Aqukin is not currently streaming any audio`, ridingAqua); 
            // checks if the user is trying to use the skip command
            if (command.name === "skip"){
                // check if the author has already voted to skip
                if(bot.music.skippers.has(message.author.id)) {return message.channel.send(`**${message.author.username}**-sama, you has voted to skip, please wait for others to vote`);}
                // check if the track has already been voted to skip
                if(bot.music.skipCount >= 1) {message.channel.send(`**${message.author.username}**-sama, Aqukin has acknowledged your vote to skip`);}
            } // end of if user called the skip command                  
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
            }
            break; // end of music case

        // a default case for other type of commands
        default:
            para = { // same collection but in this case only needed parameters
                bot: bot,
                message: message,
                args: args,
                prefix: prefix,
                ridingAqua: ridingAqua,
            }
            break; // end of default case
    } // end of switch
    return para;
} // end of commandCheck(...) function

module.exports = {typeCheck, commandCheck};