/* Main module for Aqukin */
require("dotenv").config();
const { Client, Collection } = require("discord.js");
// const { Users } = require("./database/dbObjects");
const { registerCommands, registerEvents, consoleChatter } = require("./utilities/handlers");
const bot = new Client();
bot.queue = new Map();
bot.votingSystem = new Collection();
bot.commands = new Collection(); // bot commands
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

var port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("Server listening on port " + port);
});


(async ()=>{
	await bot.login(process.env.BOT_TOKEN); // connect the bot to the Discord server

	/* handlers */
	await registerEvents(bot, "../events");
	await registerCommands(bot, "../commands");
	await consoleChatter(bot);
})();