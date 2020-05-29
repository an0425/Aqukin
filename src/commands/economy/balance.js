/* This module displays the total balance of the author or the mentioned user */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class BalanceCommand extends BaseCommand{
    constructor() {super("balance", ["cash", "money"], "Display the total balance of the mentioned user/yourself", "SEND_MESSAGES", "economy", false, false, "[mentioned user]")}
    
    async run(para){
        const {message, bot} = para;
        let target;
        if(bot.mentioned) { // if Aqukin is mentioned
            if(message.mentions.users.size>1){ // a user is also mentioned
                const users = message.mentions.users.first([2]);
                target = users[1]; // get the mentioned user
            }
            else {target = message.author;}
        }
        else{ target = message.mentions.users.first() || message.author;} // used prefix instead of mentioning Aqukin

        if(target.bot) return;

        const member = message.guild.member(target); // get the mention user via the guild member list
        // checks if the member is in the guild, if not return a message to inform the author
        if (!member) { return message.channel.send(`**${message.author.username}**-sama, it looks like the person you mentioned isn't in this guild~`, para.ridingAqua);}
        
        let reply;
        // checks if the author has tagged themselve
        if(target.id === message.author.id) reply = "you";
        else reply = `**${target.username}**-sama`;
        message.channel.send(`**${message.author.username}**-sama, ${reply} has $${bot.currency.getBalance(target.id)}`);
    } // end of run
}; // end of module.exports