/* This module displays the investments of the author/mentioned user */
const { Users } = require("../../dbObjects");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class InvestmentCommand extends BaseCommand{
    constructor() {super("investment", ["i", "stock"], "Display all the investments of the mentioned user/yourself", "SEND_MESSAGES", "economy", false, false, "[mentioned user]")}
    
    async run(para){
        const {message} = para;
        let target;
        if(para.bot.mentioned) { // if Aqukin is mentioned
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
        
        const user = await Users.findOne({ where: { user_id: target.id } });

        let reply;
        // checks if the author has tagged themselve
        if(target.id === message.author.id) reply = "you are currently";
        else reply = `**${target.username}**-sama is currently`;

        if(!user) {return message.channel.send(`**${message.author.username}**-sama, ${reply} not participating in the economy game~`);}
        
        const stocks = await user.getItems();
        // checks if the target inventory is empty or not
        if(!stocks.lenght) reply += " not investing in any establishment~";
        else reply += ` holding ${stocks.map(i => `${i.user_share} shares of the ${i.stock.name}`).join(', ')}`;
        message.channel.send(`**${message.author.username}**-sama, ${reply}`);
    } // end of run
}; // end of module.exports