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
        let settings = await bot.settings.get(message.guild.id) || await bot.settings.setPrefix(message.guild.id, process.env.PREFIX, 0);

        // checks for command
        typeCheck(bot, message, settings.prefix, bot.mentionCmd.tag).then(async (iscmd) => {
            if(!iscmd){ // checks if the message is not a command
                if(settings.react) { await react(message, bot, settings); }
                return;
            } // end of if the message is not a command

            /* anti spam */
            if(await spamCheck(bot, message)) { 
                return;
            }

            // else continue with the code
            let args = bot.mentionCmd.mentioned.get(message.guild.id) ? message.content.slice(bot.mentionCmd.tag.length).trim().split(/ +/g) : message.content.slice(settings.prefix.length).trim().split(/ +/g);
            if(!args) { return; }
            const commandName = args[0].toLowerCase();
            const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            let para = await commandCheck(bot, message, command, args, settings, settings.prefix, settings.reply);

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