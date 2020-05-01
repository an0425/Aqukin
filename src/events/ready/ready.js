/* this module represents the "ready" event */
const BaseEvent = require("../../utils/structures/BaseEvent");

module.exports = class ReadyEvent extends BaseEvent {
	constructor() {
        super("ready");
	}
	
	async run (bot){
		// activities
		const activities = ["Apex Legends", "Minecraft", "Sekiro: Shadows Die Twice", "Super Smash Bros. Ultimate", "Dark Souls III"]
		const i = Math.floor(Math.random() * Math.floor(activities.length)); 
		await bot.user.setActivity(activities[i], { type: "PLAYING" }).catch(console.error);
		console.log("Ninja Combat Maido is now ready at your service, master!");
	} // end of run
} // end of module.exports