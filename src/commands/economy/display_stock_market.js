/* This module allow the author to buy */
const { marketEmbed } = require("../../utilities/embed_constructor");
const { StockMarket } = require("../../database/dbObjects");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class DisplayStockMarketCommand extends BaseCommand{
    constructor() {super("stockmarket", ["sm", "market", "showmarket"], "Display all the firms and theirs available market shares", "SEND_MESSAGES", "economy", false, false, "")}
    
    async run(para){
        // shorcut variables
        const { message, bot } = para;

        const stocks = await StockMarket.findAll();
        // checks if the shop inventory is not empty
        if(!stocks) { return message.channel.send(`**${message.author.username}**-sama, there are no firm needing investment right now~`); }

        // construct the embed
        const embed = await marketEmbed(bot, message, stocks);
        const sentMgs = await bot.sentMarket.get(message.author.id);
        if(sentMgs) { 
            sentMgs.delete()
                   .catch((err) => { console.log(`The market message has been deleted manually~`); });
        }
        bot.sentMarket.set(message.author.id, message.channel.send(`**${message.author.username}**-sama, welcome to the stock market`, embed));
    }
}; // end of module.exports