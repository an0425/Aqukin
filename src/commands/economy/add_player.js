/* This module add the mentioned user to the economy game */
const {MessageEmbed} = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class AddPlayerCommand extends BaseCommand{
    constructor() {super("addplayer", ["ap", "add"], "Add the mentioned user to the economy game (requires Administrative rights)", "ADMINISTRATION", "economy", false, false, "[mentioned user]")}
    
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

        const user = await bot.currency.get(target.id);
        let reply;
        // checks if the author has tagged themselve
        if(target.id === message.author.id) reply = "you";
        else reply = `**${target.username}**-sama`;
        
        if(user) {return message.channel.send(`**${message.author.username}**-sama, ${reply} has already participated in the economy game`);}

        // add the target to the game
        await bot.currency.add(target.id, 1000);
        let description = `Try \`${para.prefix}help [command name]\` for more info about a specific command.\n`;
        const econCmd = await bot.commands.filter(cmd => cmd.tag === "economy")
            .forEach(cmd => description += `\n\`${para.prefix}${cmd.name} ${cmd.usage}\` -- ${cmd.description}.\n`);
        
        // construct the embed
        const {thumbnails} = bot.music;
        const embed = new MessageEmbed()
            .setColor(0x1DE2FE)
            .setThumbnail(thumbnails[Math.floor(Math.random() * Math.floor(thumbnails.length))])
            .setTitle(`Welcome ${target.username}-sama to the economy game`)
            .addFields({name: "Your Balance", value: bot.currency.getBalance(target.id)},
                       {name: `Command list, <> is mandatory [] is optional`, value: description})
            .setImage("https://media1.tenor.com/images/efe08c14a1ac2fb7d1d1773126f9b969/tenor.gif?itemid=16404461")
            .setFooter("Vive La Résistance le Hololive~");
        message.channel.send(`**${message.author.username}**-sama, ${reply} will now join the economy game as a new investor`, embed);
    } // end of run
}; // end of module.exports