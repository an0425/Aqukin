/* This module displays the total balance of the author or the mentioned user */
const { Users } = require("../../dbObjects");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class InventoryCommand extends BaseCommand{
    constructor() {super("inventory", ["items", "stocks"], "Displays the inventory of the author/mentioned user", "SEND_MESSAGES", "economy", false, false, "<none> or <mentioned user>")}
    
    async run(para){
        const {message} = para;
        let target;
        if(para.bot.tagged && message.mentions.users.size>1) {
            const users = message.mentions.users.first([2]);
            target = users[1] || message.author; // get the tagged user
        }
        else{ // tagged Aqukin or no one is tagged (get the author themselve)
            target = message.author;
        }

        if(target.bot) return;

        const member = message.guild.member(target); // get the mention user via the guild member list
        // checks if the member is in the guild, if not return a message to inform the author
        if (!member) { return message.channel.send(`**${message.author.username}**-sama, it looks like the person you mentioned isn't in this guild~`, para.ridingAqua);}
        
        const user = await Users.findOne({ where: { user_id: target.id } });
        const items = await user.getItems();

        let reply;
        // checks if the author has tagged themselve
        if(target.id === message.author.id) reply = "Your Inventory";
        else reply = `**${target.username}**-sama Inventory`;

        // checks if the target inventory is empty or not
        if(!items.lenght) reply += " is empty~";
        else reply += ` includes ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`;
        message.channel.send(`**${message.author.username}**-sama, ${reply}`);
    } // end of run
}; // end of module.exports