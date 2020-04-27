/* This module allows the author to stop Aqukin current audio streaming */
module.exports = {
    name: "stop",
    aliases: ["disconnect", "dc"],
    tag: "music",
    permission: "ADMINISTRATOR",
    args: false,
    usage: "",

    execute(para) {
        const author = para.message.author.username; // message's author username
        const channel = para.message.channel; // para.message.channel for short

        // Checks if the Aqukin is streaming any audio
        if (!para.serverQueue)   return channel.send(`${author}-sama, Aqukin is not in a voice channel right now.`);

        // Checks if the author is in the same voice channel with Aqukin
        if (para.message.member.voice.channel != para.serverQueue.voiceChannel)  return channel.send(`${author}-sama, you need to be in the same voice channel with Aqukin to use this command`);
        
        // Clear the queue and then leave the voice channel
        try{
            para.serverQueue.songs = [];
            para.serverQueue.connection.dispatcher.end();
        } catch (err){
            console.log(err);}
    },
};


    
