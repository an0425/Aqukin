const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const AntiSpam = require('discord-anti-spam');
const fs = require("fs");

const escapeRegex = str => str.replace(/[.!*+?^${}()|[\]\\]/g, '\\$&')

/* commands handller */
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
};

/* Anti-spamming */
const antiSpam = new AntiSpam({
	warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
	kickThreshold: 5, // Amount of messages sent in a row that will cause a kick.
	banThreshold: 7, // Amount of messages sent in a row that will cause a ban.
	maxInterval: 2000, // Amount of time (in milliseconds) in which messages are considered spam.
	warnMessage: '{@user}-sama, This is your OLNY and FINAL warning, please stop spamming.', // Message that will be sent in chat upon warning a user.
	kickMessage: '**{user_tag}** has been kicked for spamming.', // Message that will be sent in chat upon kicking a user.
	banMessage: '**{user_tag}** has been banned for spamming.', // Message that will be sent in chat upon banning a user.
	maxDuplicatesWarning: 7, // Amount of duplicate messages that trigger a warning.
	maxDuplicatesKick: 10, // Amount of duplicate messages that trigger a warning.
	maxDuplicatesBan: 20, // Amount of duplicate messages that trigger a warning.
	exemptPermissions: [ "ADMINISTRATOR"], // Bypass users with any of these permissions.
	ignoreBots: true, // Ignore bot messages.
	verbose: true, // Extended Logs from module.
	ignoredUsers: [], // Array of User IDs that get ignored.
});

/* Bot activation console */
client.on("ready", () => {
    console.log("Ninja Maido is now ready at your service, master!")
    client.user.setActivity("Apex Legends", { type: "PLAYING" }).catch(console.error);
});

/* Recruit greeting */
client.on("guildMemberAdd", member => {
    const channel = member.guild.chanels.find(channel => channel.name === "lobby");
    if (!channel) return;
    channel.send(`Konaqua~ master ${member}, My name is Minato Aqua your ninja combat maid, please wait for master DeaLoux to specify your server role. If he is not available you can access the server by using the following command ">noticeMeSenpai", arigatou gozamatshita~.`)
        .then(console.log)
        .catch(console.error);
});

/* Message scanner */
client.on('message', message => {
    // exclude message sent by bots
    if (message.author.bot) return;
    // antiSpam calling
    antiSpam.message(message)
    // prefix check
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(config.PREFIX)})\\s*`);
    // if message is normal chat
    if (!prefixRegex.test(message.content)) { // execute communication class
        const args = message.content.trim().split(/ +/);
        client.commands.get("communication").execute(message, args);
    }
    else { // message is a command
        const [, matchedPrefix] = message.content.match(prefixRegex);
        // command get
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);

        // execute ultilityCmd class
        client.commands.get("ultilityCmd").execute(message, args);
        // execute musicCmd class
        client.commands.get("musicCmd").execute(message, args);
    }
});

client.login(config.TOKEN);