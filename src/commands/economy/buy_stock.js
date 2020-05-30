/* This module allow the author to buy */
const { Op } = require('sequelize');
const {checkNum} = require("../../utilities/functions");
const {marketEmbed} = require("../../utilities/embed_constructor");
const { Users, StockMarket } = require("../../database/dbObjects");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class BuyStockCommand extends BaseCommand{
    constructor() {super("buy", ["b", "purchase"], "Purchase an amount of share(s) of a firm available from the stock market", "SEND_MESSAGES", "economy", true, false, "<avaiable stock> [amount]")}
    
    async run(para){
        // shorcut variables
        const {message, bot, args} = para;

        // checks if the user is requesting to buy a valid stock
        const stock = await StockMarket.findOne({ where: { name: { [Op.like]: args[0] } } });
        if(!stock){ return message.channel.send(`**${message.author.username}**-sama, the is no such firm called **${args[0]}**`); }

        if(stock.market_share === 0) { return message.channel.send(`**${message.author.username}**-sama, the **${stock.name}** has already reached its maximum share~`); }

        let amount = await checkNum(args[1], 1);
        
        if(stock.market_share < amount){ // else adjust the amount to the number of remaining share(s) if the amount exceeds it
            amount = stock.market_share;
            message.channel.send(`**${message.author.username}**-sama, Aqukin has adjusted the amount to \`${amount}\`, which is also the remaining share(s) of the **${stock.name}**`);
        }

        // checks if the author has sufficient fund to make the purchase
        const totalcost = stock.cost * amount;
        if (totalcost > bot.currency.getBalance(message.author.id)) {
            return message.channel.send(`**${message.author.username}**-sama, you have insufficient fund to purchase \`${amount}\` share(s) of the **${stock.name}**`);
        }
        
        try{
            // update the balance, user share and market share
            const user = await Users.findOne({ where: { user_id: message.author.id } });
            await user.addStock(stock, amount);
            await stock.decrement("market_share", { by: amount });
            bot.currency.add(message.author.id, -totalcost);
            message.channel.send(`**${message.author.username}**-sama, you have just purchased \`${amount}\` share(s) of the **${stock.name}** for \`$${totalcost}\``);
            
            // update the market embed if its there
            let sentMsg = await bot.sentMarket.get(message.author.id);
            if(sentMsg) {
                const stocks = await StockMarket.findAll(); 
                const embed = await marketEmbed(bot, message, stocks);
                sentMsg.edit(embed)
                       .catch((err) => {
                           console.log("The market message has been deleted manually, Aqukin will send another one~");
                           sentMsg = message.channel.send(embed);
                        }); 
            }
        } catch(err) {
            console.log(err);
            message.channel.send(`**${message.author.username}**-sama, the transaction is cancelled as an error has occured`);
        }
    } // end of run
}; // end of module.exports