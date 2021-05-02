/* Main module for Aqukin */
require("dotenv").config();
const { alive, aliveHeroku } = require("../utilities/alive");
const { Client, Collection } = require("discord.js");
const initProperties  = require("../database/properties");
const { registerCommands, registerEvents, consoleChatter } = require("../utilities/handlers");

// variables
const bot = new Client();

bot.mentionCmd = {
	tag: process.env.TAG,
	mentioned: new Collection()
};
bot.commands = new Collection(); // bot commands

// database variables
bot.media = { 
	embedColour: [ 0xBC06C4, 0x1DE2FE ],
	slappingAqua : { files: ["https://media1.tenor.com/images/9d81ec7c2abd005d8da208d2f56e89df/tenor.gif?itemid=17267165"] },
	ridingAqua : { files: ["https://media1.tenor.com/images/e6578328df71dbd6b44318553e06eda8/tenor.gif?itemid=17267168"] }
};
bot.settings = new Collection();

// variable will need to be ported to database later on
// bot.currency = new Collection(); // currency
// bot.sentMarket = new Collection(); // market message
// currency(bot);

(async ()=>{
	// opus init
	bot.music = new Collection();

	/* handlers */
	await registerEvents(bot, "../events");
	await registerCommands(bot, "../commands");
	await registerCommands(bot, "../opus/commands");
	await initProperties(bot);
	//await consoleChatter(bot);

	await bot.login(process.env.BOT_TOKEN); // connect the bot to the Discord server
	if(process.env.PROJECT_DOMAIN) { await aliveHeroku(bot); }
	else { await alive(bot); }

	process.on("warning", e => console.warn(e.stack)) // debug
})();