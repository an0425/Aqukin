/* this module represents the "message" event */
require("dotenv").config();
const BaseEvent = require("../../utils/structures/BaseEvent");
const prefix = process.env.PREFIX;

module.exports = class MessageEvent extends BaseEvent {
    constructor() {
        super("message");
    }

    async run (bot, message){
        // exclude messages sent by bots and direct messages
        if (message.author.bot || message.channel.type === "dm") return;
    
        // checks if the message is not a command
        if(!message.content.startsWith(prefix)){
            const args = message.content.trim().split(/ +/g);
            try{ // try executing the command then catch any errors
                bot.commands.get("communication").run(message, args);
            } catch (error){
                console.error(error);
            }
        }
        else{ // else the message is a command
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const commandName = args.shift().toLowerCase();
            const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        
            if (!command) return; // checks if the command is valid, if not return

            //if (command.isPrivate) return; // checks if the command is private, if so return as it shouldn't be called

            // checks if the command require and argument and whether the user has provided it
            if(command.args && !args.length){
                let reply = `**${message.author.username}**-sama, please provide an argument for this command.`; // default reply without usage
                if(command.usage) { // checks if there's a correct usage for the command
                    reply += `\nThe proper usage would be: \`**${prefix}${command.name} **${command.usage}**\``; // add the usage to the reply
                }
                return message.channel.send(reply); // return the reply to inform the author
            }

            // checks if the author has the permission to use the command, if not return a message to inform them
            if (!message.member.hasPermission(command.permission)) return message.channel.send(`I'm sorry **${message.author.username}**-sama, but it seems like you don't have the permission to use this command :(`);

            // music command checks only
            if(command.tag === "music")
            {
                const { id } = message.guild;
                const player = bot.music.players.get(id);
                const { channel }  = message.member.voice;
                // checks if the author is in a voice channel, if not return a message to inform them
                if(!channel) return message.channel.send(`**${message.author.username}**-sama, you need to be in a voice channel to use this command`);
                // checks if Aqukin is streaming any audio, excluding the play command, if not return a message to inform the author
                if(!player && command.name != "play") return message.channel.send(`**${message.author.username}**-sama, Aqukin is not currently streaming any audio`);
                // checks if Aqukin in a voice channel and the author is also in that voice channel, if not return a message to inform them
                if(player && (player.voiceChannel.id !== channel.id)) return message.channel.send(`**${message.author.username}**-sama, you need to be in the same voice channel with Aqukin to use this command`);
            }

            // construct a collection of all parameters to pass to a function to eliminate unused parameters
            const para = {
                bot: bot,
                message: message,
                args: args,
            }
            
            // try executing the command and catch any errors
            try { await command.run(para);  }
            catch (error) {console.error(error);}
        }
    }
}