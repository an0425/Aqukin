/* This module exports utilities functions 
const { VoiceConnection, StreamDispatcher } = require("discord.js");
const BasePlayer = require("../utilities/structures/BasePlayer");

// This function registers all the necessary VoiceConnection events
async function VC_events(bot){

    VoiceConnection.on("error", async (err) =>{
        await BasePlayer.textChannel.send(`**${author.username}**-sama, \`${err}\` 。 ゜ ゜ (´Ｏ\`) ゜ ゜。`);
        await bot.music.delete(BasePlayer.id);
    })

    .once("disconnect", async () =>{
        // catch in case the message got deleted manually
        await BasePlayer.queue.splice(0);
        if(VoiceConnection.dispatcher){ await VoiceConnection.dispatcher.end(); }
        await bot.votingSystem.delete(BasePlayer.id);
        await bot.music.delete(BasePlayer.id);
    });
}

// This function registers all the necessary VoiceBroadcast events
async function VB_events(bot){
    StreamDispatcher.on("error", async (err) =>{
        await BasePlayer.textChannel.send(`**${BasePlayer.queue[0].requester.username}**-sama, \`${err}\` has occured when ${bot.user.username} was trying to play track \`${BasePlayer.queue[0].title}\` 。 ゜ ゜ (´Ｏ\`) ゜ ゜。`);
    })

    .on("start", async () =>{
        // now playing embed constructing and sending
        BasePlayer.seeking = false;
        const embed = await musicEmbed(bot, BasePlayer, BasePlayer.queue[0]);
        // send the embed to inform about the now playing track
        BasePlayer.sentMessage = await BasePlayer.textChannel.send(embed).catch(err => console.log("an error has occurered trying to send the embed", err));
    })
    
    .on("finish", async () =>{
        await VoiceBroadcast.destroy();
    })
    .once("close", async () => {
        // loop status checks
        if(!BasePlayer.seeking) {
            await bot.votingSystem.delete(BasePlayer.id);
            if(BasePlayer.trackRepeat) { await BasePlayer.queue.splice(1, 0, BasePlayer.queue[0]); }
            else if(BasePlayer.queueRepeat) { await BasePlayer.loopqueue.push(BasePlayer.queue[0]); }
            if(BasePlayer.queue[0]) { BasePlayer.queue[0].seek = 0; }
        }

        await BasePlayer.queue.shift();
        await playing(bot, BasePlayer);
        await BasePlayer.sentMessage.delete().catch(err => console.log(err)); // try catch in case the message got deleted manually
    })
}

module.exports = { VC_events, VB_events }; */