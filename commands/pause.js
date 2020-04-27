/* This module allows the author to pause Aqukin current audio streaming */
module.exports = {
    name: "pause",
    aliases: [],
    tag: "music",
    permission: "CONNECT",
    args: false,
    usage: "",

    execute(para){
        const author = para.message.author.username; // message's author username
        const channel = para.message.channel; // para.message.channel for short
        
        // Checks if the author is in the same voice channel with Aqukin
        if (para.message.member.voice.channel != para.serverQueue.voiceChannel)  return channel.send(`${author}-sama, you need to be in the same voice channel with Aqukin to use this command`);
        // Checks if the Aqukin is streaming any audio
        if (!para.serverQueue)   return channel.send(`${author}-sama, Aqukin is not streaming any audio right now so there's nothing to pause`);
        
        try{
            channel.send(`${author}-sama, Aqukin has paused audio streaming`);
            para.serverQueue.connection.dispatcher.pause();
        } catch (err){
            console.log(err);}
    },
};



    
