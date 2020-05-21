/* Main module for Aqukin */
require("dotenv").config();
const { ErelaClient } = require("erela.js");
const {Client, Collection} = require("discord.js");
const {registerCommands, registerEvents, registerMusicEvents, consoleChatter} = require("./utilities/handlers");
const bot = new Client();
bot.commands = new Collection(); // bot commands
bot.antispam = {
	msgCount: 0, // a variable to store the number of (potential spam messages)
	muted: new Set(), // a variable to store if the user who have been muted
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

	/* handlers */
	await registerMusicEvents(bot.music, "../music_events");
	await registerEvents(bot, "../events");
	await registerCommands(bot, "../commands");
	consoleChatter(bot);
})();