const Discord = require("discord.js")
const ytdl = require('ytdl-core');
var musicQueue = {};

module.exports = {
    name: "musicCmd",
    description: "Aqukin main script for music commands",

    /* Main function for script execution */
    execute(message, args) {
        switch (args[0].toLowerCase()) {
            /* Music commands */
            case "play":
            case "p":
                function play(connection, message) {
                    var mQueue = musicQueue[message.guild.id];
                    if (!mQueue.queue[1]) {
                        // validate if the input is an url
                        let isURL = ytdl.validateURL(args[1]);
                        if (isURL) { // if the input is an url
                            mQueue.dispatcher = connection.play(ytdl(mQueue.queue[0], { filter: "audioonly" }));
                        }
                        else { // else use the keyword to search for an youtube video

                        }

                        mQueue.dispatcher.on("finish", function () {
                            mQueue.queue.shift();
                            if (mQueue.queue[0])
                                play(connection, message);
                            else
                                mQueue.queue.push(args[1]);
                        });
                    }
                };

                if (!args[1]) 
                    return message.channel.send(`${message.author.username}-sama, Aqukin can't play without a link or query :(`);

                const voiceChannel = message.member.voice.channel;
                if (!voiceChannel)
                    return message.channel.send(`${message.author.username}-sama, Aqukin can't join you if you are not in a voice channel first :(`);

                    if (!musicQueue[message.guild.id]) musicQueue[message.guild.id] = {
                        queue: []
                    }

                    var mQueue = musicQueue[message.guild.id];

                    mQueue.queue.push(args[1]);

                voiceChannel.join().then(connection => {
                    play(connection, message);
                });                 

                break;

            case "this":
            case "current":
            case "c":
                break;

            case "skip":
            case "next":
            case "nxt":
            case "s":
            case "n":
                var mQueue = musicQueue[message.guild.id];
                if (mQueue.dispatcher) mQueue.dispatcher.end();
                message.channel.send("Aqukin will now skip to the next track~");
                break;

            case "loop":
            case "l":
                break;

            case "forward":
            case "f":
                break;

            case "pause":
                var mQueue = musicQueue[message.guild.id];
                if (mQueue.dispatcher) mQueue.dispatcher.pause();
                message.channel.send("Aqukin will now pause audio streaming~");
                break;

            case "resume":
                var mQueue = musicQueue[message.guild.id];
                if (mQueue.dispatcher) mQueue.dispatcher.resume();
                message.channel.send("Aqukin will now resume audio streaming~");
                break;

            case "clear":
                break;

            case "shuffle":
                break;

            case "view":
            case "queue":
            case "v":
                break;

            case "disconnect":
            case "dc":
            case "stop":
                var mQueue = musicQueue[message.guild.id];
                if (mQueue.dispatcher) {
                    mQueue.queue = [];
                    mQueue.dispatcher.end();
                    mQueue.voice.channel.leave();
                    message.channel.send("Aqukin has stopped audio streaming, will be leaving the channel soon, arigatou gozaimatshita~")
                    console.log('Aqukin has stopped streaming')
                }
                break;
        }
    }
}