/* Main module for Aqukin */
require("dotenv").config();
const { ErelaClient } = require("erela.js");
const { Client, Collection } = require("discord.js");
const { Users } = require("./database/dbObjects");
const { registerCommands, registerEvents, registerMusicEvents, consoleChatter } = require("./utilities/handlers");
const bot = new Client();
bot.commands = new Collection(); // bot commands
bot.currency = new Collection(); // currency
bot.sentMarket = new Collection(); // market message

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
});

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