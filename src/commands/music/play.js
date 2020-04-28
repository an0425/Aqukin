/* This module allows the author to queue youtube URL or keyword to Aqukin audio streaming */
const BaseCommand = require("../../utils/structures/BaseCommand");
const { MessageEmbed } = require('discord.js');

module.exports = class PlayCommand extends BaseCommand{
    constructor() {super("play",["p"], "CONNECT", "music", false, true, "<Youtube URL or Keywords>")}

    async run (para){
        // shortcut variables
        const bot = para.bot;
        const msg = para.message;
        const author = para.message.author.username;
        
        const query = para.args.join(" ");
        console.log(query);
        
        
        // spawns a player inside the author's voice channel
        const { channel } = msg.member.voice
        const player = bot.music.players.spawn({
            guild: msg.guild,
            voiceChannel: channel,
            textChannel: msg.channel,
        });

        try { // try and catch any errors
            // searches the results with the given keywords
            let i = 0;
            const searchResults = await bot.music.search(query, msg.author);
            const tracks = searchResults.tracks.slice(0, 10);
            const tracksInfo = tracks.map(r => `${++i}) ${r.title}\n    ${r.uri}`).join("\n");
        
            // embed the result(s)
            const embed = new MessageEmbed()
                .setAuthor(bot.user.tag, bot.user.displayAvatarURL())
                .setDescription(tracksInfo)
                .setFooter(`${author}-sama, here's your music results`);
  
            
            const sentMessage = await msg.channel.send(`**${author}**-sama, please enter the track number that you would like Aqukin to queue.`, embed); // display the embed
            sentMessage.delete({ timeout: 10000 }); // delete the embed after 10s

            // Allow the author to select a track fron the search results within the allowed time of 10s
            const filter = m => (msg.author.id === m.author.id) && (m.content >= 1 && m.content <= tracks.length);
            const response = await msg.channel
                .awaitMessages(filter, { max: 1, time: 10000, errors: ['time']});

            if (response) {
                await msg.channel.bulkDelete(1); // delete the user respond
                const entry = response.first().content;
                const player = bot.music.players.get(msg.guild.id);
                const track = tracks[entry-1];
                player.queue.add(track);
                msg.channel.send(`**${author}**-sama, Aqukin has enqueued track **${track.title}**`);
                if (!player.playing) player.play();
            }
        } catch (err) {console.log(err);}
    }
};

    
