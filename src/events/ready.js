/* this module represents the "ready" event */
//const { Users } = require("../database/dbObjects");
require("dotenv").config();
const { Collection } = require("discord.js");
const BaseEvent = require("../utilities/structures/BaseEvent");

module.exports = class ReadyEvent extends BaseEvent {
	constructor() { super("ready"); }
	
	async run (bot){
		// Database variables
		// const storedBalances = await Users.findAll();
		// storedBalances.forEach(b => bot.currency.set(b.user_id, b));

		// Bot variables
		bot.author = await bot.users.fetch(process.env.BOT_AUTHOR);
		bot.music = new Collection();
		bot.votingSystem = new Collection();

		if(bot.settings.enableantispam){
			bot.antispam = {
				muteTime: 20000, // a variable to store the mute time
				msgThreshhold: 3, // a variable to store the threshold
				msgCount: new Collection(), // a variable to store the number of (potential spam messages)
				muted: new Set(), // a variable to store if the user who have been muted
				msgRecently: new Set(), // a variable to store the user who have send a message within the cooldown time
				warned: new Set() // a variable to store the user who have been warned
			};
		}
		
		// Activities
		const activities = ["Apex Legends", "Minecraft", "Super Mario Bros. 3", "Sekiro: Shadows Die Twice", "Dark Souls", "Super Mario Maker 2", "Super Mario Bros.", "Final Fantasy VII Remake", "Super Smash Bros. Ultimate", "Dark Souls III", "Super Mario Bros. 2", "Ring Fit Adventure"];
		setInterval(() => {
			bot.user.setActivity(activities[Math.floor(Math.random() * Math.floor(activities.length))], { type: "PLAYING" }); }, 7200000);
		console.log("Diamond ninja combat baka maid is now ready at your service, master!");
	} // end of run
} // end of module.exports