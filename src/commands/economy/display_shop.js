/* This module allow the author to buy */
const { Users, CurrencyShop } = require("../../dbObjects");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class BuyItemCommand extends BaseCommand{
    constructor() {super("displayshop", ["ds", "shop", "display"], "Display the inventory of the shop", "SEND_MESSAGES", "economy", false, false, "")}
    
    async run(para){
        // shorcut variables
        const {message, bot} = para;

        const items = await CurrencyShop.findAll();
        // checks if the shop inventory is not empty
        if(!items){
            return message.channel.send(`**${message.author.username}**-sama, the shop is currently out of stock`);
        }

        message.channel.send(items.map(item => `${item.name}: ${item.cost}💰`).join('\n'), { code: true });}
}; // end of module.exports