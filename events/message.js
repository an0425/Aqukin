/* this module represents the "message" event */
const {prefix} = require("../config.json")

module.exports = async (bot, message) => {
    // exclude messages sent by bots and direct messages
    if (message.author.bot || message.channel.type === "dm") return;
    
    // checks if the message is not a command
    if(!message.content.startsWith(prefix)){
        const args = message.content.trim().split(/ +/g);
        try{ // try executing the command then catch any errors
            bot.commands.get("communication").execute(message, args);
        } catch (error){
            console.error(error);
        }
    }
    else{ // else the message is a command
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        const serverQueue = bot.queue.get(message.guild.id);
        // construct a collection of all parameters to pass to a function to eliminate unused parameters
        const para = {
            bot: bot,
            message: message,
            args: args,
            serverQueue: serverQueue,
        }
        
        if (!command) return; // checks if the command is valid

        // checks if the command require and argument and whether the user has provided it
        if(command.args && !args.length){
            let reply = `${message.author.username}-sama, please provide an argument for this command.`; // default reply without usage
            if(command.usage) { // checks if there's a correct usage for the command
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``; // add the usage to the reply
            }
            return message.channel.send(reply); // return the reply to inform the author
        }

        // checks if the author has administrative permission
        if (!message.member.hasPermission(command.permission)) return message.channel.send(`I'm sorry ${message.author.username}-sama, but it seems like you don't have the permission to use this command :(`);
        
        try { // try executing the command then catch any errors
           await command.execute(para);
        } catch (error) {
            console.error(error);
        }
    }
}