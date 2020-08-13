/* this module represents the "message" event */
require("dotenv").config();
const BaseEvent = require("../utilities/structures/BaseEvent");
const { react } = require("../utilities/artificial_intelligence/communication");
const { spamCheck, typeCheck, commandCheck } = require("../utilities/message_checks");

module.exports = class MessageEvent extends BaseEvent {
    constructor() { super("message"); }

    async run (bot, message){
        // exclude messages sent by bots and direct messages
        if (message.author.bot || message.channel.type === "dm") { return; }

        // get the prefix
        let settings = await bot.settings.getSettings(message.guild.id);
        
        if(!settings){
            setings = await bot.settings.setPrefix(message.guild.id, process.env.PREFIX, 0, 0);
        }

        // checks for command
        typeCheck(bot, message, settings.prefix, bot.mentionCmd.tag).then(async (iscmd) => {
            if(!iscmd){ // checks if the message is not a command
                const args = message.content.trim().split(/ +/g);
                if(settings.react) { await react(message, bot); }
                return;
            } // end of if the message is not a command

            /* anti spam */
            if(bot.antispam.has(message.author.id)) { 
                return message.channel.send(`**${message.author.username}**-sama, you are rushing ${bot.user.username} hard, please be patient ＼(º □ º l|l)/`, { files: ["https://media1.tenor.com/images/9d81ec7c2abd005d8da208d2f56e89df/tenor.gif?itemid=17267165"] });
            }
            await spamCheck(bot, message);

            // else continue with the code
            let args;
            if(await bot.mentionCmd.mentioned.get(message.guild.id)) { args = message.content.slice(bot.mentionCmd.tag.length).trim().split(/ +/g); }
            else { args = message.content.slice(settings.prefix.length).trim().split(/ +/g); }
            if(!args) { return; }
            const commandName = args[0].toLowerCase();
            const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            let para = await commandCheck(bot, message, command, args, settings.prefix, settings.reply);

            // checks if the parameters is returned, if not do nothing
            if(!para) { 
                await bot.mentionCmd.mentioned.delete(message.guild.id);
                return; 
            } 

            // try executing the command and catch any errors
            command.run(para).catch((err) => {
                console.log(err); 
                message.channel.send(`**${message.author.username}**-sama, \`${err}\``);
            });
            await bot.mentionCmd.mentioned.delete(message.guild.id);
        })
        .catch((err) => console.log(err));
    } // end of run
}// end of module.exports