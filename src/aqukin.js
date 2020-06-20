/* Main module for Aqukin */
require("dotenv").config();
const { Client, Collection } = require("discord.js");
// const { Users } = require("./database/dbObjects");
const { alive } = require("./utilities/alive");
const { registerCommands, registerEvents, registerMediaFiles, consoleChatter } = require("./utilities/handlers");
const bot = new Client();
bot.commands = new Collection(); // bot commands
bot.media = {
	gifs: [],
	thumbnails: []
};
bot.mentionCmd = {
	tag: process.env.TAG,
	mentioned: new Collection()
};

// variable will need to be ported to database later on
bot.settings = {
	enableantispam: true,
	enablecommunication: false,
	enablereaction: true,
	prefix: process.env.PREFIX
};

//bot.currency = new Collection(); // currency
//bot.sentMarket = new Collection(); // market message

/*
Reflect.defineProperty(bot.currency, "add", {
	value: async function add(id, amount) {
		const user = bot.currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		bot.currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(bot.currency, "getBalance", {
	value: function getBalance(id) {
		const user = bot.currency.get(id);
		return user ? user.balance : 0;
	},
}); */

(async ()=>{
	await bot.login(process.env.BOT_TOKEN); // connect the bot to the Discord server

	/* handlers */
	await registerEvents(bot, "../events");
	await registerCommands(bot, "../commands");
	await registerMediaFiles(bot, "../utilities/pictures");
	await alive();
	await consoleChatter(bot);
})();