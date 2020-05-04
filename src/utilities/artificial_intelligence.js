/* This module is Aqukin artificial intelligence (PROTOTYPE) */
const ms = require("ms");

// This function checks for spam, very basic and will be updated
async function spamCheck(bot, message, prefix){
    if(message.member.hasPermission("ADMINISTRATOR")) return; // exclude spam check for admins
    // checks if the user has just sent a message recently, if not keep track of their message
    if(!bot.antispam.msgRecently.has(message.author.id)){ 
        bot.antispam.msgRecently.add(message.author.id) // their message will now be recorded as recently sent
        setTimeout(() => {bot.antispam.msgRecently.delete(message.author.id)}, 2000); // rapid messages within less than 2 seconds interval will be considered spam
        bot.antispam.isSpam = false;
    }
    else { // else the user did spam
        // checks if the user has been warned, if so mute them, if not warn them
        if(bot.antispam.warned.has(message.author.id)){
            // mute
            const muteTime = 20000;
            const mutedMember = message.member;
            currentRoles = message.member.roles.cache;
            const mutedRole = message.guild.roles.cache.find(role => role.name === "Muted");
            // checks if there exists a mute role in this guild, if not inform the author
            if (!mutedRole) return message.channel.send(`${message.author.username}-sama, please inform the guild admins prepare a role called \`Muted\` before using any of the commands`);
            
            bot.antispam.isSpam = true;
            mutedMember.roles.remove(currentRoles).then(console.log).catch(console.error); // remove all current roles
            mutedMember.roles.add(mutedRole.id);
            message.channel.send(`${mutedMember.user.tag} have been muted for \`${ms(muteTime)}\``);

            setTimeout(function(){ // after the mute
                bot.antispam.isSpam = false;
                mutedMember.roles.add(currentRoles); // add all the roles back
                mutedMember.roles.remove(mutedRole.id); // remove the muted role
                message.channel.send(`**${mutedMember.user.username}**-sama, muting restrictions have been lifted`);
            }, muteTime)
        } 
        else{
            bot.antispam.isSpam = true;
            bot.antispam.warned.add(message.author.id); // keep a record that they had been warned
            setTimeout(() => {bot.antispam.msgRecently.delete(message.author.id)}, 60000); // the warning is effective for 1 minutes
            return message.channel.send(`**${mutedMember.user.username}**-sama, please don't spam, it won't make you a better person`); // warn them
        } // end of else warned
    } // end of else msgRecently
} // end of spamCheck(...) function

// This function handles Aqukin's random reacting ability
async function react(message){
    var emojiList = Array.from(message.guild.emojis.cache.map(e => e.id.toString())); // an array contains all the custom emojis id of the server
    const index = Math.floor(Math.random() * Math.floor(emojiList.length)); // random index for the emoji list
    const reactChance = 0.3; // message reaction chance
    if(Math.random() <= reactChance){ message.react(emojiList[index]); }
}

// This function handles Aqukin's communcating ability
async function communicate(message, args){
    // shortcut variables
    const author = message.author.username; // message's author username
    const channel = message.channel; // para.message.channel for short
    const jikoshoukai = "Atashi, Akua~, seigi no mikata, dai tenshi~ , Hololive Resistance, kono Minato Aqua da."; // variable for Aqukin's self introduction

    for (var i = 0; i < args.length; i++) { // search for matching word
        switch (args[i].toLowerCase()) {   
            case "chao":
            case "nihao":
            case "hi":
            case "hello":
            case "hey":
            case "yahallo":
            case "yahallo~":
            case "konbanwa":
            case "konbanwa~":
            case "konichiwa":
            case "konichiwa~":
            case "konaqua":
            case "konaqua~":
                channel.send(`Konaqua~ **${author}**-sama.`)
                break;
                
            case "yo":
            case "ye":
            case "yeah":
            case "yes":
                channel.send(args[i]);
                break;
    
            case "namae":
            case "name":
            case "who":
            case "jikoshoukai":
                channel.send(jikoshoukai)
                break;
    
            case "teiki":
                channel.send("Ahh...")
                break;
    
            case "good":
                if (!args[i + 1]) return;
                switch (args[i + 1].toLowerCase()) {
                    case "morning":
                        channel.send(`Ohayo~ ***${author}**-sama, have you had breakfast yet?`)
                        break;
                    case "afternoon":
                        channel.send(`Ohayo~ **${author}**-sama, have you had lunch yet?`);
                        break;
                    case "day":
                        channel.send(`Good day to you too **${author}**-sama.`);
                        break;
                    case "night":
                        channel.send(`Oyasuminasai~ **${author}**-sama.`);
                        break;
                    case "job":
                        channel.send(`Arigatou gozaimatsu~ **${author}**-sama.`);
                        break;
                    default:
                        channel.send(`It truly is **${author}**-sama.`);
                        break;
                }
                break;

            case "help":
                channel.send(`**${author}**-sama, if you need help with commands, try "${prefix}help" instead~`);
                break;
    
            case "fighto":
                channel.send("Oohh");
                break;
    
            case "nani":
            case "nani?":
                channel.send("Omae mou shindeiru");
                break;
    
            case "vui":
            case "lol":
            case "kusa":
            case "www":
            case "草":
            case "くさ":
                channel.send("www");
                break;
    
            case "wibu":
            case "weaboo":
            case "weeb":
            case "weebs":
                channel.send("Wibu detected!");
                break;
    
            case "baka":
                channel.send("Baka janai, Baqua desu~");
                break;
    
            case "trash":
            case "gomi":
                channel.send("Gomi janai~~");
                break;
    
            case "what":
            case "huh":
            case "wut":
                channel.send("Nani?");
                break;
    
            case "ohayo":
            case "ohayo~":
                channel.send(`Ohayo~ **${author}**-sama, have you had breakfast yet?`);
                break;
    
            case "g9":
            case "oyasumi":
            case "oyasumi~":
            case "oyasuminasai":
            case "oyasuminasai~":
                channel.send(`Oyasuminasai~ **${author}**-sama.`);
                break;
        } // end of switch
    } // end of for loop
} // end of communicate(...) function

module.exports = {spamCheck, react, communicate};