/* This module is the user interface for Aqukin's help */
const { MessageEmbed } = require('discord.js');
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class HelpCommand extends BaseCommand{
    constructor() {super("help", ["h"], "Provide info about commands", "SEND_MESSAGES", "utility", false, "[command name/alias]", "move -- will show info about the move command")}
    
    async run(para) {
        // shortcut variables
        const { message, bot } = para;
        const { author, channel } = message;
        const { gifs } = bot.media;
        
        if(para.args.length){ // if the author has asked for help with a specific command
            const commandName = para.args[0].toLowerCase();
            const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            // checks if there's a command with the given argurment, if not return a message to inform the author
            if(!command) { return channel.send(`**${author.username}**-sama, Aqukin can't find any command with that name (´-﹃-\`), try ${prefix}help if you need the commands list`); }

            // construct the embed
            const cmdInfoEmbed = new MessageEmbed()
                .setColor(0x1DE2FE)
                .setThumbnail("https://media1.tenor.com/images/32618947eafb05a4e09dc819a3872440/tenor.gif?itemid=17189882")
                .setTitle(`[] is optional, <> is mandatory`)
                .addFields({name: "Command name", value: command.name, inline: true},
                           {name: "Aliases", value: command.aliases.join('\n'), inline: true},
                           {name: "Usage", value: `${para.prefix}${command.name} ${command.usage}`},
                           {name: "Usage Example", value: `${para.prefix}${command.name} ${command.usageEx}`},
                           {name: "Description", value: command.description},)
                .setImage(gifs[Math.floor(Math.random() * Math.floor(gifs.length))])
                .setFooter("Vive La Résistance le Hololive ٩(ˊᗜˋ*)و");
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
            const settingsCmds = await bot.commands
                .filter(cmd => cmd.tag === "settings")
                .map(cmd => `\`${cmd.name}\``).join(" ");
            const econCmds = await bot.commands
                .filter(cmd => cmd.tag === "economy")
                .map(cmd => `\`${cmd.name}\``).join(" ");
            
            // construct the embed
            const helpEmbed = new MessageEmbed()
                .setColor(0x1DE2FE)
                .setThumbnail("https://media1.tenor.com/images/e4d23a9fb9a1dab0b47c84029883dfb7/tenor.gif?itemid=17189878")
                .setTitle(`**${author.username}**-sama, here's the list of Aqukin's commands`)
                .addFields({ name: "Current Prefix", value: `\`${para.prefix}\`` }, 
                           { name: "Music commands", value: musicCmds }, 
                           { name: "Ultility commands", value: utilsCmds },
                           { name: "Settings commands", value: settingsCmds },)
                           //{ name: "Economy commands", value: econCmds },
                .setImage(gifs[Math.floor(Math.random() * Math.floor(gifs.length))])
                .setFooter("Vive La Résistance le Hololive ٩(ˊᗜˋ*)و");
            channel.send(`You can send \`${para.prefix}help [command name]\` to get info on a specific command ( ˊᵕˋ)ﾉˊᵕˋ)`, helpEmbed); // send out the embed
        } // end of else
    } // end of run
}; // end of module.exports