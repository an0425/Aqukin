/* this module represents the "ready" event */
const { Collection } = require("discord.js");
const BaseEvent = require("../utilities/structures/BaseEvent");
const { Users, Guilds, Media } = require("../database/dbObjects");

module.exports = class ReadyEvent extends BaseEvent {
	constructor() { super("ready"); }
	
	async run (bot){
		// bot variables
		bot.votingSystem = new Collection();
			
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

		await Media.findOne({ where: { id: 1 } }).then(media => {
			bot.media = {
				gifs: media.gifs,
				dogeza: media.dogeza,
				bakaqua: media.bakaqua,
				baquafina: media.baquafina,
				thumbnails: media.thumbnails,
				activities: media.activities
			}
		});

		// activities
		const { activities } = bot.media;
		setInterval(() => {
			bot.user.setActivity(activities[Math.floor(Math.random() * Math.floor(activities.length))], { type: "PLAYING" }); }, 7200000);
		console.log(`${bot.user.username}, your diamond ninja combat baka maid is now ready at your service, master!`);
	} // end of run
} // end of module.exports