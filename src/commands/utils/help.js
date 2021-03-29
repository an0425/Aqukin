/* This module is the user interface for the bot help command */
const { MessageEmbed } = require('discord.js');
const BaseCommand = require("../../utilities/structures/BaseCommand");
const { convertBoolean } = require("../../utilities/functions");

module.exports = class HelpCommand extends BaseCommand{
    constructor() {super("help", ["hm", "helpme"], "Provide info about commands", "SEND_MESSAGES", "utility", false, "[command name/alias]", "move -- will show info about the move command")}
    
    async run(para) {
        // shortcut variables
        const { message, bot } = para;
        const { author, channel } = message;
        const { embedColour } = bot.media;
        
        if(para.args.length){ // if the author has asked for help with a specific command
            const commandName = para.args[0].toLowerCase();
            const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            // checks if there's a command with the given argurment, if not return a message to inform the author
            if(!command) { 
                return channel.send(`**${author.username}**-sama, ${bot.user.username} can't find any command with that name ლ (ಠ_ಠ ლ), try \`${para.prefix}help\` if you need the commands list`); 
            }

            // construct the embed
            const cmdInfoEmbed = new MessageEmbed()
                .setColor(embedColour.random())
                .setThumbnail(await bot.media.getMedia("thumbnails"))
                .setTitle(`[] is optional, <> is mandatory`)
                .addFields({ name: "Prefix", value: `\`${para.prefix}\``, inline: true },
                           { name: "Name", value: command.name, inline: true },
                           { name: "Aliases", value: command.aliases.join('\n'), inline: true },
                           { name: "Usage", value: `${para.prefix}${command.name} ${command.usage}` },
                           { name: "Usage Example", value: `${para.prefix}${command.name} ${command.usageEx}` },
                           { name: "Description", value: command.description },
                           { name: "Detailed Guide", value: `[Wiki](https://github.com/DeaLoux/Aqukin/wiki)`})
                .setImage(await bot.media.getMedia("gifs"))
                .setFooter("FREEDOM SMILE (^)o(^)b");
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
            /*
                const econCmds = await bot.commands
                .filter(cmd => cmd.tag === "economy")
                .map(cmd => `\`${cmd.name}\``).join(" "); */
            
            // construct the embed
            const helpEmbed = new MessageEmbed()
                .setColor(embedColour.random())
                .setThumbnail(await bot.media.getMedia("thumbnails"))
                .setTitle(`You can try \`${para.prefix}help [command name]\` to get info on a specific command ☆ ⌒ (≧ ▽ °)`)
                .addFields({ name: "Current Prefix", value: `\`${para.prefix}\``, inline: true }, 
                           { name: "Detailed Guide", value: `[Wiki](https://github.com/DeaLoux/Aqukin/wiki)`, inline: true },
                           { name: "Music commands", value: musicCmds }, 
                           { name: "Ultility commands", value: utilsCmds },)
                           //{ name: "Economy commands", value: econCmds },
                .setImage(await bot.media.getMedia("gifs"))
                .setFooter("FREEDOM SMILE (^)o(^)b");

            if(message.member.hasPermission("ADMINISTRATOR")){
                const settings = await bot.settings.get(message.guild.id);
                const TBA = "TBA";
                //const channel = await message.channel.guild.channels.cache.has(settings.announcement_ch) ? message.channel.guild.channels.cache.get(settings.announcement_ch).name : "No channel is set aru";
                const settingsCmds = await bot.commands
                    .filter(cmd => cmd.tag === "settings")
                    .map(cmd => `\`${cmd.name}\``).join(" ");
                
                helpEmbed.addFields(
                    { name: "Settings commands (Admin/Owner only)", value: settingsCmds },
                    { name: "**Current Settings**", value: `Message Reply - \`${convertBoolean(settings.reply)}\`
                                                            Message React - \`${convertBoolean(settings.react)}\`
                                                            Twitter Fanarts - \`${/*convertBoolean(settings.artfeed)*/ TBA}\`
                                                            Default Message Number (cleanmessage) - \`${settings.default_msg_num}\`
                                                            Announcement channel - \`${/*channel*/ TBA}\``},
                );
            }
            
            channel.send(`**${author.username}**-sama, here's the list of ${bot.user.username}'s commands (つ ≧ ▽ ≦) つ`, helpEmbed); // send out the embed
        } // end of else
    } // end of run
}; // end of module.exports