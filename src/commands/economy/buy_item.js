/* This module allow the author to buy */
const { Op } = require('sequelize');
const { Users, StockMarket } = require("../../dbObjects");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class BuyItemCommand extends BaseCommand{
    constructor() {super("buy", ["b", "purchase"], "Purchase a share available from the stock market", "SEND_MESSAGES", "economy", true, false, "<avaiable stock>")}
    
    async run(para){
        // shorcut variables
        const {message, bot} = para;

        const stock = await StockMarket.findOne({ where: { name: { [Op.like]: para.args } } });
        // checks if the user is requesting to buy a valid stock
        if(!stock){
            return message.channel.send(`**${message.author.username}**-sama, the is no such item called \`${para.args}\``);
        }
        // checks if the author has sufficient fund to make the purchase
        if (stock.cost > currency.getBalance(message.author.id)) {
            return message.channel.send(`**${message.author.username}**-sama, you have insufficient fund to purchase \`${stock.name}\``);
        }
        // checks if the stock is still holding its share
        if(1===0){
            return message.channel.send(`**${message.author.username}**-sama, the \`${stock.name}\` is currently out of stock`);
        }
        
        const user = await Users.findOne({ where: { user_id: message.author.id } });
        bot.currency.add(message.author.id, -stock.cost);
        await user.addItem(stock);

        message.channel.send(`**${message.author.username}**-sama, you have just purchased \`${stock.name}\` for \`${stock.cost}\``);
    } // end of run
}; // end of module.exports