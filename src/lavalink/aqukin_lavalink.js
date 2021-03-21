/* Main module for Aqukin */
require("dotenv").config();
const { Manager } = require("erela.js");
//const { Shoukaku } = require('shoukaku');
const { alive, aliveHeroku } = require("../utilities/alive");
const { Client, Collection } = require("discord.js");
const initProperties = require("../database/properties");
const { registerCommands, registerEvents, LavalinkMusicEvents, consoleChatter } = require("../utilities/handlers");

// variables
const bot = new Client();
bot.mentionCmd = {
	tag: process.env.TAG,
	mentioned: new Collection()
};
bot.commands = new Collection(); // bot commands

// database variables
bot.media = { embedColour: [ 0xBC06C4, 0x1DE2FE ] };
bot.settings = new Collection();

// variable will need to be ported to database later on
// bot.currency = new Collection(); // currency
// bot.sentMarket = new Collection(); // market message
// currency(bot);

(async ()=>{
	// Lavalink erela init
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
	bot.music.lavalink = true;
	
	/* handlers */
	await registerEvents(bot, "../events");
	await registerCommands(bot, "../commands");
	await registerCommands(bot, "../lavalink/commands");
	await LavalinkMusicEvents(bot, "../lavalink/music_events");
	await initProperties(bot);
	//await consoleChatter(bot);

	await bot.login(process.env.BOT_TOKEN); // connect the bot to the Discord server
	bot.music.init(bot.user.id);
	if(process.env.PROJECT_DOMAIN) { await aliveHeroku(bot); }
	else
		await alive(bot);

	process.on("warning", e => console.warn(e.stack)) // debug
})();