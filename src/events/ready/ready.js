/* this module represents the "ready" event */
const BaseEvent = require("../../utilities/structures/BaseEvent");

module.exports = class ReadyEvent extends BaseEvent {
	constructor() {
        super("ready");
	}
	
	async run (bot){
		// activities
		const activities = ["Apex Legends", "Minecraft", "Sekiro: Shadows Die Twice", "Super Smash Bros. Ultimate", "Dark Souls III", "Super Mario Bros. 2", "Ring Fit Adventure"];
		setInterval(async () => {
			await bot.user.setActivity(activities[Math.floor(Math.random() * Math.floor(activities.length))], { type: "PLAYING" })
		}, 5400000)
		console.log("Ninja Combat Maido is now ready at your service, master!");
	} // end of run
} // end of module.exports