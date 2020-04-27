/* Main module for Aqukin */
const {Client, Collection} = require("discord.js");
const {token} = require("./config.json");
const {readdirSync} = require("fs");
const bot = new Client();
bot.commands = new Collection();
bot.queue = new Map();

/* Handlers */
const handlers = readdirSync("./handlers").filter(file => file.endsWith(".js"));
for (const file of handlers) {
	require(`./handlers/${file}`)(bot);
}

bot.login(token); // connect the bot to the Discord server