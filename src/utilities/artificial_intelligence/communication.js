/* This module handles Aqukin's communicating ability */

// This function handles Aqukin's random reacting ability
async function react(message){
    const emojiList = Array.from(message.guild.emojis.cache.map(e => e.id.toString())); // an array contains all the custom emojis id of the server
    if(Math.random() <= 0.3) message.react(emojiList[Math.floor(Math.random() * Math.floor(emojiList.length))]); 
} // end of react(...) function

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
                channel.send(`Konaqua~ **${author}**-sama (\`･ω･´)`)
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
                channel.send(`**${author}**-sama, if you want to get my info try \`${prefix}ui <tag me>\` instead (\`･ω･´)`)
                break;
    
            case "teiki":
                channel.send("Ahh...")
                break;
    
            case "good":
            case "gud":
                if (!args[i + 1]) return;
                switch (args[i + 1].toLowerCase()) {
                    case "morning":
                        channel.send(`Ohayo~ **${author}**-sama, have you had breakfast yet? ( ˊᵕˋ)ﾉˊᵕˋ)`)
                        break;
                    case "afternoon":
                        channel.send(`Ohayo~ **${author}**-sama, have you had lunch yet? ( ˊᵕˋ)ﾉˊᵕˋ)`);
                        break;
                    case "day":
                        channel.send(`Good day to you too **${author}**-sama ( ˊᵕˋ)ﾉˊᵕˋ)`);
                        break;
                    case "night":
                        channel.send(`Oyasuminasai~ **${author}**-sama ( ˊᵕˋ)ﾉˊᵕˋ)`);
                        break;
                    case "job":
                    case "bot":
                        channel.send(`Arigatou gozaimatsu~ **${author}**-sama ( ˊᵕˋ)ﾉˊᵕˋ)`);
                        break;
                    case "girl":
                        channel.send(`She truly is **${author}**-sama ٩(ˊᗜˋ*)و`);
                        break;
                    case "boy":
                        channel.send(`He truly is **${author}**-sama ٩(ˊᗜˋ*)و`);
                        break;
                    default:
                        channel.send(`It truly is **${author}**-sama ٩(ˊᗜˋ*)و`);
                        break;
                }
                break;

            case "help":
                channel.send(`**${author}**-sama, if you need help with commands, try \`${prefix}help\` instead (\`･ω･´)`);
                break;
    
            case "fighto":
                channel.send("Oohh ٩(ˊᗜˋ*)و");
                break;
    
            case "nani":
            case "nani?":
                channel.send("Omae mou shindeiru _(ˇωˇ」∠)\\_");
                break;
    
            case "vui":
            case "lol":
            case "kusa":
            case "www":
            case "草":
            case "くさ":
                channel.send("www ₍^ •⌄• ^₎");
                break;
    
            case "wibu":
            case "weaboo":
            case "weeb":
            case "weebs":
                channel.send("Wibu detected");
                break;
    
            case "baka":
                channel.send("Baka janai, Baqua desu _(ˇωˇ」∠)\\_");
                break;
    
            case "trash":
            case "gomi":
                channel.send("Gomi janai _(ˇωˇ」∠)\\_");
                break;
    
            case "what":
            case "huh":
            case "wut":
                channel.send("Nani? _(´ㅅ`)⌒)\\_");
                break;
    
            case "ohayo":
            case "ohayo~":
                channel.send(`Ohayo~ **${author}**-sama, have you had breakfast yet? ( ˊᵕˋ)ﾉˊᵕˋ)`);
                break;
    
            case "g9":
            case "oyasumi":
            case "oyasumi~":
            case "oyasuminasai":
            case "oyasuminasai~":
                channel.send(`Oyasuminasai~ **${author}**-sama ( ˊᵕˋ)ﾉˊᵕˋ)`);
                break;
        } // end of switch
    } // end of for loop
} // end of communicate(...) function

module.exports = {react, reply};