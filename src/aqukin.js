/* Main module for Aqukin */
require("dotenv").config();
const { Manager } = require("erela.js");
const { alive } = require("./utilities/alive");
const { Client, Collection } = require("discord.js");
const { settings, currency } = require("./database/properties");
const { registerCommands, registerEvents, registerMusicEvents, consoleChatter } = require("./utilities/handlers");

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

// variable will need to be ported to database later on
// bot.currency = new Collection(); // currency
// bot.sentMarket = new Collection(); // market message
// currency(bot);

(async ()=>{
	// erela
	bot.music = new Manager({nodes: [{
		host: "localhost",
		port: process.env.LL_PORT-0,
		password: process.env.LL_PASSWORD,
		secure: false
	}],
		autoPlay: true,
		send(id, payload) {
			const guild = bot.guilds.cache.get(id);
			if (guild) guild.shard.send(payload);
		},
	});
	bot.on("raw", d => bot.music.updateVoiceState(d));

	/* handlers */
	await registerEvents(bot, "../events");
	await registerCommands(bot, "../commands");
	await registerMusicEvents(bot, "../music_events");
	await settings(bot);
	//await consoleChatter(bot);

	await bot.login(process.env.BOT_TOKEN); // connect the bot to the Discord server
	//await alive(bot);
	await bot.music.init(bot.user.id);
})();