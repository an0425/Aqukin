/* This module allow the author to buy */
const { Users, StockMarket } = require("../../dbObjects");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class DisplayStockMarketCommand extends BaseCommand{
    constructor() {super("showmarket", ["sm", "market", "stockmarket"], "Display all the firms and theirs available market shares", "SEND_MESSAGES", "economy", false, false, "")}
    
    async run(para){
        // shorcut variables
        const {message, bot} = para;

        const stocks = await StockMarket.findAll();
        // checks if the shop inventory is not empty
        if(!stocks){
            return message.channel.send(`**${message.author.username}**-sama, the shop is currently out of stock`);
        }

        message.channel.send(stocks.map(stock => `${stock.name}: ${stock.cost}💰: ${stock.market_share} share(s)`).join('\n'), { code: true });}
}; // end of module.exports