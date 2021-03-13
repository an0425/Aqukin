/* This module help Aqukin staying alive on Heroku hosting service by pinging its domaince once every 5 minutes */
require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();

async function alive(bot){
	app.get("/", (request, response) => {
		response.sendStatus(200);
	});
		  
	let PORT = process.env.PORT || 8080;
	app.listen(PORT, () => {
    	console.log(`${bot.user.username} is running on port ${ PORT }`);
	});

	setInterval(() => { 
		http.get(process.env.PROJECT_DOMAIN); 
		bot.music.forEach(async player => {
			const members = await player.connection.channel.members.filter(m => !m.user.bot);
            if(members.size === 0){
                try{
                    await player.connection.disconnect(); 
                    return player.textChannel.send(`Dear masters, please don't leave ${bot.user.username} alone in a voice chat room like that (｡╯︵╰｡)`);
                } catch(err) { console.log("Error occured while disconnecting from voice chat while being left alone", err); }
            }
		});
	}, 280000);
}

async function alive2(bot){
	setInterval(() => { 
		bot.music.forEach(async player => {
			const members = await player.connection.channel.members.filter(m => !m.user.bot);
            if(members.size === 0){
                try{
                    await player.connection.disconnect(); 
                    return player.textChannel.send(`Dear masters, please don't leave ${bot.user.username} alone in a voice chat room like that (｡╯︵╰｡)`);
                } catch(err) { console.log("Error occured while disconnecting from voice chat while being left alone", err); }
            }
		});
	}, 560000);
}

module.exports = { alive, alive2 };