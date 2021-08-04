/* Main module for Aqukin */
require("dotenv").config();
const { Manager } = require("erela.js");
//const { Shoukaku } = require('shoukaku');
const { aliveLavalink, aliveHerokuLavalink } = require("../utilities/alive");
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
	if(process.env.PROJECT_DOMAIN) { await aliveHerokuLavalink(bot); }
	// else { await aliveLavalink(bot); }

	process.on("warning", e => console.warn(e.stack)) // debug
})();