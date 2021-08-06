/* This module help Aqukin staying alive on Heroku hosting service by pinging its domaince once every 5 minutes */
require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();

async function pingOpus(bot){
	bot.music.forEach(async player => {
		const members = await player.connection.channel.members.filter(m => !m.user.bot);
		if(members.size === 0){
			try{
				await player.connection.disconnect(); 
				return player.textChannel.send(`Dear masters, please don't leave ${bot.user.username} alone in a voice chat room like that (｡╯︵╰｡)`);
			} catch(err) { console.log("Error occured while disconnecting from voice chat while being left alone", err); }
		}
	});
}

async function pingLavalink(bot){
	bot.music.players.forEach(async player => {
		const channel = await bot.channels.cache.get(player.voiceChannel);
		const members = channel.members.filter(m => !m.user.bot);
		if(members.size === 0){
			try{
				await player.disconnect(); 
				return player.textChannel.send(`Dear masters, please don't leave ${bot.user.username} alone in a voice chat room like that (｡╯︵╰｡)`);
			} catch(err) { console.log("Error occured while disconnecting from voice chat while being left alone", err); }
		}
	});
}

async function aliveOpus(bot){
	setInterval(() => { pingOpus(bot); }, 560000);
}

async function aliveLavalink(bot){
	setInterval(() => { pingLavalink(bot); }, 560000);
}

async function aliveHerokuOpus(bot){
	app.get("/", (request, response) => {
		response.sendStatus(200);
	});
		  
	let PORT = process.env.PORT || 8080;
	app.listen(PORT, () => {
    	console.log(`${bot.user.username} is running on port ${ PORT }`);
	});

	setInterval(() => { 
		http.get(process.env.PROJECT_DOMAIN); 
		pingOpus(bot);
	}, 280000);
}

async function aliveHerokuLavalink(bot){
	app.get("/", (request, response) => {
		response.sendStatus(200);
	});
		  
	let PORT = process.env.PORT || 8080;
	app.listen(PORT, () => {
    	console.log(`${bot.user.username} is running on port ${ PORT }`);
	});

	setInterval(() => { 
		http.get(process.env.PROJECT_DOMAIN); 
		pingLavalink(bot);
	}, 280000);
}

module.exports = { aliveOpus, aliveLavalink, aliveHerokuOpus, aliveHerokuLavalink };