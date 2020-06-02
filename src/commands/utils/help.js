/* This module is the user interface for Aqukin's help */
const { MessageEmbed } = require('discord.js');
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class HelpCommand extends BaseCommand{
    constructor() {super("help", ["h"], "Provide info about commands", "SEND_MESSAGES", "utility", false, false, "[command]")}
    
    async run(para) {
        // shortcut variables
        const { message, bot } = para;
        const { author, channel } = message;
        
        if(para.args.length){ // if the author has asked for help with a specific command
            const commandName = para.args[0].toLowerCase();
            const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            // checks if there's a command with the given argurment, if not return a message to inform the author
            if(!command) { return channel.send(`**${author.username}**-sama, Aqukin can't find any command with that name~`, para.ridingAqua); }

            // construct the embed
            const images = ["https://media1.tenor.com/images/224db5f05470946e4c60ca9afea7597f/tenor.gif?itemid=17308034", 
                            "https://media1.tenor.com/images/b7254b1f7083b0d8088905de997ef5bb/tenor.gif?itemid=17177480"];      
            const cmdInfoEmbed = new MessageEmbed()
                .setColor(0x1DE2FE)
                .setThumbnail("https://media1.tenor.com/images/32618947eafb05a4e09dc819a3872440/tenor.gif?itemid=17189882")
                .setTitle(`[] is optional, <> is mandatory`)
                .addFields({name: "Command name", value: command.name, inline: true},
                           {name: "Aliases", value: command.aliases.join('\n'), inline: true},
                           {name: "Usage", value: `${para.prefix}${command.name} ${command.usage}`},
                           {name: "Description", value: command.description},)
                .setImage(images[Math.floor(Math.random() * Math.floor(images.length))])
                .setFooter("Vive La Résistance le Hololive~");
            channel.send(`**${author.username}**-sama, here's the info of the \`${command.name}\` command`, cmdInfoEmbed); // send out the embed
        } // end of if
        
        else { // else the author just need general help
            // get the command names
            const musicCmds = await bot.commands
                .filter(cmd => cmd.tag === "music")
                .map(cmd => `\`${cmd.name}\``).join(" ");
            const utilsCmds = await bot.commands
                .filter(cmd => cmd.tag === "utility")
                .map(cmd => `\`${cmd.name}\``).join(" ");
            const econCmds = await bot.commands
                .filter(cmd => cmd.tag === "economy")
                .map(cmd => `\`${cmd.name}\``).join(" ");
            
            // construct the embed
            const images = ["https://media1.tenor.com/images/99bb4621f5bcd7fd358a7f4068b6f69c/tenor.gif?itemid=16936961", 
                            "https://media1.tenor.com/images/cdd5329801ad282290ad6bb0f65896ec/tenor.gif?itemid=16527235"];
            const helpEmbed = new MessageEmbed()
                .setColor(0x1DE2FE)
                .setThumbnail("https://media1.tenor.com/images/e4d23a9fb9a1dab0b47c84029883dfb7/tenor.gif?itemid=17189878")
                .setTitle(`You can send \`${para.prefix}help [command name]\` to get info on a specific command~`)
                .addFields({ name: "Music commands", value: musicCmds }, 
                           { name: "Ultility commands", value: utilsCmds },)
                           //{ name: "Economy commands", value: econCmds },
                .setImage(images[Math.floor(Math.random() * Math.floor(images.length))])
                .setFooter("Vive La Résistance le Hololive~");
            channel.send(`**${author.username}**-sama, here's the list of Aqukin's commands, the current prefix is "${para.prefix}"`, helpEmbed); // send out the embed
        } // end of else
    } // end of run
}; // end of module.exports