/* this module represents the "message" event */
require("dotenv").config();
const BaseEvent = require("../utilities/structures/BaseEvent");
const { typeCheck, commandCheck } = require("../utilities/message_checks");
const { antiSpam } = require("../utilities/artificial_intelligence/antiSpam");
const { react, reply } = require("../utilities/artificial_intelligence/communication");

module.exports = class MessageEvent extends BaseEvent {
    constructor() {super("message");}

    async run (bot, message){
        // exclude messages sent by bots and direct messages
        if (message.author.bot || message.channel.type === "dm") { return; }

        // anti spam
        if(bot.settings.enableantispam){
            if(bot.antispam.muted.has(message.author.id)) { return; }
            await antiSpam(bot, message);
            if(bot.antispam.warned.has(message.author.id)) { return; }
        }
        
        await bot.mentionCmd.mentioned.set(message.guild.id, false);
        
        // checks for command
        const iscmd = await typeCheck(bot, message, bot.settings.prefix, bot.mentionCmd.tag);
        if(!iscmd){ // checks if the message is not a command
            const args = message.content.trim().split(/ +/g);
            try{
                if(bot.settings.enablereaction) { await react(message); }
                if(bot.settings.enablecommunication) { await reply(message, args, bot.settings.prefix); }
            } catch (err){console.log(err);} // try to react, communicate and catch any errors
            return;
        } // end of if the message is not a command
       
        // else continue with the code
        let args;
        if(await bot.mentionCmd.mentioned.get(message.guild.id)) { args = message.content.slice(bot.mentionCmd.tag.length).trim().split(/ +/g); }
        else { args = message.content.slice(bot.settings.prefix.length).trim().split(/ +/g); }
        if(!args) { return; }
        const commandName = args.shift().toLowerCase();
        const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        let para = await commandCheck(bot, message, command, args, bot.settings.prefix);

        if(!para) { 
            await bot.mentionCmd.mentioned.set(message.guild.id, false);
            return; 
        } // checks if the parameters is returned, if not do nothing

        // try executing the command and catch any errors
        try{
            await command.run(para);
            await bot.mentionCmd.mentioned.set(message.guild.id, false);
        } catch (err){console.log(err);}
    } // end of run
}// end of module.exports