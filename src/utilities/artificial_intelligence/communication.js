/* This module handles Aqukin's communicating ability */

// This function handles Aqukin's random reacting ability
async function react(message){
    var emojiList = Array.from(message.guild.emojis.cache.map(e => e.id.toString())); // an array contains all the custom emojis id of the server
    const reactChance = 0.3; // message reaction chance
    if(Math.random() <= reactChance){ message.react(emojiList[Math.floor(Math.random() * Math.floor(emojiList.length))]); }
}

// This function handles Aqukin's replying ability
async function reply(message, args, prefix){
    // shortcut variables
    const author = message.author.username; // message's author username
    const channel = message.channel; // para.message.channel for short

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
                channel.send(`**${author}**-sama, if you want to get my info try \`>info <tag me>\` instead~`)
                break;
    
            case "teiki":
                channel.send("Ahh...")
                break;
    
            case "good":
                if (!args[i + 1]) return;
                switch (args[i + 1].toLowerCase()) {
                    case "morning":
                        channel.send(`Ohayo~ **${author}**-sama, have you had breakfast yet?`)
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

module.exports = {react, reply};