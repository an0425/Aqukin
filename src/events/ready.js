/* this module represents the "ready" event */
//const { Users } = require("../database/dbObjects");
const BaseEvent = require("../utilities/structures/BaseEvent");

module.exports = class ReadyEvent extends BaseEvent {
	constructor() {super("ready");}
	
	async run (bot){
		// Database variables
		// const storedBalances = await Users.findAll();
		// storedBalances.forEach(b => bot.currency.set(b.user_id, b));

		// Bot variables
		bot.mentioned = false;
		bot.antispam = {
			msgCount: 0, // a variable to store the number of (potential spam messages)
			muted: new Set(), // a variable to store if the user who have been muted
			msgRecently: new Set(), // a variable to store the user who have send a message within the cooldown time
			warned: new Set() // a variable to store the user who have been warned
		};

		// Activities
		const activities = ["Apex Legends", "Minecraft", "Sekiro: Shadows Die Twice", "Super Smash Bros. Ultimate", "Dark Souls III", "Super Mario Bros. 2", "Ring Fit Adventure"];
		setInterval(() => {
			bot.user.setActivity(activities[Math.floor(Math.random() * Math.floor(activities.length))], { type: "PLAYING" });}, 7200000);
		console.log("Diamond Ninja Combat Maid is now ready at your service, master!");
	} // end of run
} // end of module.exports