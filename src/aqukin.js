/* Main module for Aqukin */
require("dotenv").config();
const { ErelaClient } = require("erela.js");
const {Client, Collection} = require("discord.js");
const {registerCommands, registerEvents, registerMusicEvents, consoleChatter} = require("./utils/register");
const bot = new Client();
bot.commands = new Collection();

(async ()=>{
	await bot.login(process.env.BOT_TOKEN); // connect the bot to the Discord server

	/* erela */
	bot.music = new ErelaClient(bot, [{
		host: process.env.HOST,
		port: process.env.PORT,
		password: process.env.PASSWORD
	}]);
	
	/* handlers */
	await registerMusicEvents(bot.music, "../music_events");
	await registerCommands(bot, "../commands");
	await registerEvents(bot, "../events");
	await consoleChatter(bot);
})();