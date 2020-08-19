/* Main module for Aqukin */
require("dotenv").config();
const { Client, Collection } = require("discord.js");
const { settings, currency } = require("./database/properties");
const { alive } = require("./utilities/alive");
const { registerCommands, registerEvents, consoleChatter } = require("./utilities/handlers");

// variables
const bot = new Client();
bot.antispam = new Set();
bot.mentionCmd = {
	tag: process.env.TAG,
	mentioned: new Collection()
};
bot.commands = new Collection(); // bot commands

// database variables
bot.settings = new Collection();
settings(bot);

// variable will need to be ported to database later on
// bot.currency = new Collection(); // currency
// bot.sentMarket = new Collection(); // market message
// currency(bot);

(async ()=>{
	await bot.login(process.env.BOT_TOKEN); // connect the bot to the Discord server

	/* handlers */
	await registerEvents(bot, "../events");
	await registerCommands(bot, "../commands");
	//await alive(bot);
	await consoleChatter(bot);
})();