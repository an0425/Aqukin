/* this module represents the "ready" event */
require("dotenv").config();
const { Collection } = require("discord.js");
const BaseEvent = require("../utilities/structures/BaseEvent");
const { Guilds/*, Users */ } = require("../database/dbObjects");

module.exports = class ReadyEvent extends BaseEvent {
	constructor() { super("ready"); }

	async run (bot){
		// bot variables
		bot.votingSystem = new Collection();

		bot.antispam = {
			trackingList : new Collection(),
			deltaList : new Collection()
		} 
			
		// database variables
		/*
		await Users.findAll().then(storedBalances => {
			storedBalances.forEach(b => bot.currency.set(b.user_id, b));
		}); */
		
		await Guilds.findAll().then(storedGuilds => {
			storedGuilds.forEach(g => { 
				bot.settings.set(g.guild_id, g);
			});
		});

		// activities
		setInterval(async () => { bot.user.setActivity(await bot.media.getMedia("activities"), { type: "PLAYING" }); }, 7200000);
		console.log(`${bot.user.username}, your diamond ninja combat baka maid is now ready at your service, master!`);
	} // end of run
} // end of module.exports