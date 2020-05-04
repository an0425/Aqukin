/* This module exports a console chatter function and functions that handling commands and events by recursivesly look for ".js" files in commands/events folders and their sub-folders and  */
const path = require("path");
const fs = require("fs").promises;
const BaseEvent = require ("./structures/BaseEvent");
const BaseCommand = require ("./structures/BaseCommand");

// Commands handler
async function registerCommands(bot, dir = ""){
    const filePath = path.join(__dirname, dir);
    //console.log(filePath)
    const files = await fs.readdir(filePath);
    for(const file of files){
        const stat = await fs.lstat(path.join(filePath, file));
        if(stat.isDirectory()) registerCommands(bot, path.join(dir, file));

        if(file.endsWith(".js")){
            const Command = require(path.join(filePath, file));
            if(Command.prototype instanceof BaseCommand) {
                const cmd = new Command();
                bot.commands.set(cmd.name, cmd);
            } // end of if
        } // end of if
    } // end of for loop
} // end of registerCommands(...) function

// Events handler
async function registerEvents(bot, dir = ""){
    const filePath = path.join(__dirname, dir);
    //console.log(filePath)
    const files = await fs.readdir(filePath);
    for(const file of files){
        const stat = await fs.lstat(path.join(filePath, file));
        if(stat.isDirectory()) registerEvents(bot, path.join(dir, file));

        if(file.endsWith(".js")){
            const Event = require(path.join(filePath, file));
            if(Event.prototype instanceof BaseEvent) {
                const event = new Event();
                bot.on(event.name, event.run.bind(event, bot));
            } // end of if
        } // end of if
    } // end of for loop
} // end of registerEvents(...) function

// Music Events handler
async function registerMusicEvents(bot, dir = ""){
    const filePath = path.join(__dirname, dir);
    //console.log(filePath)
    const files = await fs.readdir(filePath);
    for(const file of files){
        const stat = await fs.lstat(path.join(filePath, file));
        if(stat.isDirectory()) registerMusicEvents(bot, path.join(dir, file));

        if(file.endsWith(".js")){
            const Event = require(path.join(filePath, file));
            if(Event.prototype instanceof BaseEvent) {
                const event = new Event();
                bot.on(event.name, event.run.bind(event, bot));
            } // end of if
        } // end of if
    } // end of for loop
} // end of registerMusicEvents(...) function

// This function allows you to chat as Aqukin through the terminal  
async function consoleChatter(bot){
    let listener = process.openStdin();
    listener.addListener("data", res =>{
        let text = res.toString().trim().split(/ +/g);
        bot.channels.cache.get("623712309688401967").send(text.join(" "));
    }) // end of listener.addListener
} // end of consoleChatter(bot) function

module.exports = {registerCommands, registerEvents, registerMusicEvents, consoleChatter};