/* This module allows the author to resume Aqukin current audio streaming */
module.exports = {
    name: "resume",
    aliases: [],
    tag: "music",
    permission: "CONNECT",
    args: false,
    usage: "",

    execute(para){
        const author = para.message.author.username; // message's author username
        const channel = para.message.channel; // para.message.channel for short

        // Checks if the Aqukin is streaming any audio
        if (!para.serverQueue)   return channel.send(`${author}-sama, Aqukin is not streaming any audio right now so there's nothing to resume`);

        // Checks if the author is in the same voice channel with Aqukin
        if (para.message.member.voice.channel != para.serverQueue.voiceChannel)  return channel.send(`${author}-sama, you need to be in the same voice channel with Aqukin to use this command`);
        
        try{
            channel.send(`${author}-sama, Aqukin has resumed audio streaming`);
            para.serverQueue.connection.dispatcher.resume();
        } catch (err){
            console.log(err);}
    },
};



    
