var jikoshoukai = "Atashi, Akua~, seigi no mikata, dai tenshi~ , Hololive Resistance, kono Minato Aqua da."; // variable for Aqukin's self introduction

module.exports = {
    name: "communication",
    description: "Aqukin main script for communication",

    /* Main function for script execution */
    execute(message, args) {
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
                    message.channel.send(`Konaqua~ ${message.author.username}-sama.`)
                        .then(console.log)
                        .catch(console.error);
                    break;

                case "namae":
                case "name":
                case "who":
                case "jikoshoukai":
                    message.channel.send(jikoshoukai)
                        .then(console.log)
                        .catch(console.error);
                    break;

                case "teiki":
                    message.channel.send("Ahh...")
                    break;

                case "good":
                    if (!args[i + 1]) return;
                    switch (args[i + 1].toLowerCase()) {
                        case "morning":
                            message.channel.send(`Ohayo~ ${message.author.username}-sama, have you had breakfast yet?`)
                            break;
                        case "afternoon":
                            message.channel.send(`Ohayo~ ${message.author.username}-sama, have you had lunch yet?`);
                            break;
                        case "day":
                            message.channel.send(`Good day to you too ${message.author.username}-sama.`);
                            break;
                        case "night":
                            message.channel.send(`Oyasuminasai~ ${message.author.username}-sama.`);
                            break;
                        case "job":
                            message.channel.send(`Arigatou gozaimatsu~ ${message.author.username}-sama.`);
                            break;
                        default:
                            message.channel.send(`It truly is ${message.author.username}-sama.`);
                            break;
                    }
                    break;

                case "fighto":
                    message.channel.send("Oohh");
                    break;

                case "nani":
                case "nani?":
                    message.channel.send("Omae mou shindeiru");
                    break;

                case "vui":
                case "lol":
                case "kusa":
                case "www":
                    message.channel.send("www");
                    break;

                case "wibu":
                    message.channel.send("Wibu detected!");
                    break;

                case "baka":
                case "baqua":
                    message.channel.send("Baka janai, Baqua desu~");
                    break;

                case "trash":
                case "gomi":
                    message.channel.send("Gomi janai~~");
                    break;

                case "what":
                case "huh":
                case "wut":
                    message.channel.send("Wot?");
                    break;

                case "ohayo":
                case "ohayo~":
                    message.channel.send(`Ohayo~ ${message.author.username}-sama, have you had breakfast yet?`);
                    break;

                case "g9":
                case "oyasumi":
                case "oyasumi~":
                case "oyasuminasai":
                case "oyasuminasai~":
                    message.channel.send(`Oyasuminasai~ ${message.author.username}-sama.`);
                    break;
            }
        }
    }
}