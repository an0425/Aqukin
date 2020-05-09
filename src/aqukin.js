/* Main module for Aqukin */
require("dotenv").config();
const { ErelaClient } = require("erela.js");
const {Client, Collection} = require("discord.js");
const {registerCommands, registerEvents, registerMusicEvents, consoleChatter} = require("./utilities/handlers");
const bot = new Client();
bot.commands = new Collection(); // bot commands
bot.antispam = {
	isSpam: false, // a variable to store if the message is a spam
	muted: false, // a variable to store if the author is muted
	msgRecently: new Set(), // a variable to store the user who have send a message within the cooldown time
	warned: new Set() // a variable to store the user who have been warned
};

(async ()=>{
	await bot.login(process.env.BOT_TOKEN); // connect the bot to the Discord server
	
	// erela
	bot.music = new ErelaClient(bot, [{
		host: process.env.HOST,
		port: process.env.PORT,
		password: process.env.PASSWORD
	}]);
	bot.music.skipCount = 0; // default to 0
	bot.music.skippers = new Collection(); // a variable to store the user who have voted to skip

	/* handlers */
	await registerMusicEvents(bot.music, "../music_events");
	await registerEvents(bot, "../events");
	await registerCommands(bot, "../commands");
	consoleChatter(bot);
})();