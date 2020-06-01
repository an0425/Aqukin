/* This module displays the investment portfolio of the author/mentioned user */
const { MessageEmbed } = require("discord.js");
const { Users } = require("../../database/dbObjects");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class InvestmentPortfolioCommand extends BaseCommand{
    constructor() {super("investmentportfolio", ["ip", "balance", "portfolio", "investment"], "Display the investment portfolio of the mentioned user/yourself", "SEND_MESSAGES", "economy", false, false, "[mentioned user]")}
    
    async run(para){
        const { message } = para;
        let target;
        if(para.bot.mentioned) { // if Aqukin is mentioned
            if(message.mentions.users.size>1){ // a user is also mentioned
                const users = message.mentions.users.first([2]);
                target = users[1]; // get the mentioned user
            }
            else { target = message.author; }
        }
        else{ target = message.mentions.users.first() || message.author;} // used prefix instead of mentioning Aqukin

        if(target.bot) { return; }

        const member = message.guild.member(target); // get the mention user via the guild member list
        // checks if the member is in the guild, if not return a message to inform the author
        if (!member) { return message.channel.send(`**${message.author.username}**-sama, it looks like the person you mentioned isn't in this guild~`, para.ridingAqua);}
        
        const user = await Users.findOne({ where: { user_id: target.id } });

        let title;
        // checks if the author has tagged themselve
        if(target.id === message.author.id) title = "Your";
        else title = `**${target.username}**-sama`;

        if(!user) { return message.channel.send(`**${message.author.username}**-sama, ${title} need to be an investor first~`); }
        
        let description = "";
        const stocks = await user.getStocks();
        // console.log(stocks, stocks.count);
        // checks if the target inventory is empty or not
        if(stocks.count === 0) { description += `**${target.username}-sama** has not invested in any establishment~`; }
        else{
            // reply += ` holding ${stocks.rows.map(i => `${i.user_share} shares of the ${i.stock.name}`).join(', ')}`;
            stocks.rows.forEach(async us => {
                description += `\nThe **${us.stock.name}**\n \`Held Share(s)\` -- ${us.user_share} \n`;
            }); // end of for each
        }
        // construct the embed
        const { thumbnails } = para.bot.music;
        const embed = new MessageEmbed()
            .setColor(0x1DE2FE)
            .setThumbnail(thumbnails[Math.floor(Math.random() * Math.floor(thumbnails.length))])
            .setTitle(`${title} portfolio`)
            .addFields({ name: "Your Balance", value: `$${para.bot.currency.getBalance(target.id)}`, inline: true },
                       { name: "Economy Role", value: `${user.econrole}`, inline: true },
                       { name: "Investment(s)", value: `${description}` })
            .setImage("https://media1.tenor.com/images/c0e9bb7fbe7ae685ca2c7aa214e82cdc/tenor.gif?itemid=17166292")
            .setFooter("Vive La Résistance le Hololive~");
        message.channel.send(`**${message.author.username}**-sama, this is`, embed);
    } // end of run
}; // end of module.exports