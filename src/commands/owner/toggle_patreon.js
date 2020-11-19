/* This module allow the OWNER to toggle the patreon status of the given guild */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class TogglePatreonCommand extends BaseCommand{
    constructor() {super("togglepatreon", ["tp", "patreon"], "Toggle the given guild patreon status", "SEND_MESSAGES", "owner", true, "<guild_id>", "123...9 -- will toggle the guild with id 123...9 patreon status")}
    
    async run(para){
        // shortcut variables
        const { message, bot, args } = para;

        const guild = await bot.guilds.fetch(args[0]);
        if(!guild){
            return message.channel.send(`**${message.author.username}**-sama, ${bot.user.username} can not find any guild with that id`);
        }

        const settings = await bot.settings.togglePatreon(guild.id);

        let reply = settings.patreon ? `is now a patreon (´｡ • ω • ｡\`) ♡` : `is no longer a patreon w (° ｏ °) w`;
        message.channel.send(`**${message.author.username}**-sama, guild \`${guild.name}\` ${reply}`);
    } // end of run
}; // end of module.exports