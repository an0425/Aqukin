/* This module allow the author to buy */
const { Op } = require('sequelize');
const { Users, CurrencyShop } = require("../../dbObjects");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class BuyItemCommand extends BaseCommand{
    constructor() {super("buy", ["purchase"], "Buys an item from the currency shop", "SEND_MESSAGES", "economy", true, false, "<avaiable item>")}
    
    async run(para){
        // shorcut variables
        const {message, bot} = para;

        const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: para.args } } });
        // checks if the user is requesting to buy an valid item
        if(!item){
            return message.channel.send(`**${message.author.username}**-sama, the is no such item called \`${para.args}\``);
        }
        // checks if the author has sufficient fund to make the purchase
        if (item.cost > currency.getBalance(message.author.id)) {
            return message.channel.send(`**${message.author.username}**-sama, you have insufficient fund to purchase \`${item.name}\``);
        }
        // checks if the item is still instock
        if(1===0){
            return message.channel.send(`**${message.author.username}**-sama, the \`${item.name}\` is currently out of stock`);
        }
        
        const user = await Users.findOne({ where: { user_id: message.author.id } });
        bot.currency.add(message.author.id, -item.cost);
        await user.addItem(item);

        message.channel.send(`**${message.author.username}**-sama, you have just purchased \`${item.name}\` for \`${item.cost}\``);
    } // end of run
}; // end of module.exports