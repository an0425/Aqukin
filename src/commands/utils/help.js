/* This module is the user interface for Aqukin's help */
const { MessageEmbed } = require('discord.js');
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class HelpCommand extends BaseCommand{
    constructor() {super("help", [], "Provide info about commands", "SEND_MESSAGES", "ultility", false, "[command]")}
    
    run(para) {
        // shortcut variables
        const channel = para.message.channel;
        const author = para.message.author.username;
        
        if(para.args.length){ // if the author has asked for help with a specific command
            const commandName = para.args[0].toLowerCase();
            const command = para.bot.commands.get(commandName) || para.bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            // checks if there's a command with the given argurment, if not return a message to inform the author
            if(!command) return channel.send(`**${author}**-sama, Aqukin can't find any command with that name~`, para.ridingAqua);

            // construct the embed      
            const cmdInfoEmbed = new MessageEmbed()
                .setColor(0x1DE2FE)
                .setTitle(`**${author}**-sama, here's the info of the \`${command.name}\` command`)
                .setDescription(`
                    **Name:** ${command.name}
                    **Aliases:** ${command.aliases.join(', ')}
                    **Usage:** >${command.name} \`${command.usage}\`
                **Info:** ${command.description}`)
                .setImage("https://media1.tenor.com/images/d73ea483fd6426c4b1981e486e520070/tenor.gif?itemid=16874709")
                .setFooter(`\n[] is optional, <> is mandatory`)
            channel.send(cmdInfoEmbed); // send out the embed
        } // end of if
        
        else { // else the author just need general help
            // get the command names
            const [music, utility] = para.bot.commands.partition(cmd => cmd.tag === "music"); // partitioning the collection by the "music" tag
            var musicCmds = music.map(cmd => cmd.name.toString()).join("\n");
            var utilsCmds = utility.map(cmd => cmd.name.toString()).join("\n");
            // construct the embed
            const helpEmbed = new MessageEmbed()
                .setColor(0x1DE2FE)
                .setTitle(`**${author}**-sama, here's the list of Aqukin's commands, the prefix is "${para.prefix}"`)
                .addFields({name: "Music commands", value: musicCmds, inline: true}, 
                           {name: "Ultility commands", value: utilsCmds, inline: true})
                .setImage("https://media1.tenor.com/images/99bb4621f5bcd7fd358a7f4068b6f69c/tenor.gif?itemid=16936961")
                .setFooter(`\nYou can send \`${para.prefix}help [command name]\` to get info on a specific command~`)
            channel.send(helpEmbed); // send out the embed
        } // end of else
    } // end of run
}; // end of module.exports