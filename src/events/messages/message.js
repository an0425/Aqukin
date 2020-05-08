/* this module represents the "message" event */
require("dotenv").config();
const BaseEvent = require("../../utilities/structures/BaseEvent");
const {antiSpam} = require("../../utilities/artificial_intelligence/antiSpam");
const {typeCheck, commandCheck} = require("../../events/messages/checks.js");
const {react, reply} = require("../../utilities/artificial_intelligence/communication");
const prefix = process.env.PREFIX;

module.exports = class MessageEvent extends BaseEvent {
    constructor() {
        super("message");
    }

    async run (bot, message){
        // exclude messages sent by bots and direct messages
        if (message.author.bot || message.channel.type === "dm") return;

        // anti spam
        if(bot.antispam.muted) return;
        await antiSpam(bot, message);
        if(bot.antispam.isSpam) return;
        
        // checks for command
        var iscmd = await typeCheck(message, prefix);
        if(iscmd){ // if the message is a command
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const commandName = args.shift().toLowerCase();
            const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            var para = await commandCheck(bot, message, command, args, prefix);
            
            if(!para) return; // checks if the parameters is returned, if not do nothing

            // try executing the command and catch any errors
            try { await command.run(para); }
            catch (error) {console.error(error);}
        } // end of if the message is a command
        else{ // else the message is a normal chat
            const args = message.content.trim().split(/ +/g);
            try{
                react(message);
                reply(message, args, prefix);
            } catch (err){console.log(err);} // try to react, communicate and catch any errors
        } // end of else the message is a normal chat
    } // end of run
}// end of module.exports