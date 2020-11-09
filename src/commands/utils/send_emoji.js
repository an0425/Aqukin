/* This module allow the bot to send a guild custom emoji on the author behalf */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class SendEmojiCommand extends BaseCommand{
    constructor() {super("sendemoji", ["se", "sendemote"], "Allow the bot to send a guild custom emoji on your behalf", "SEND_MESSAGES", "utility", true, "<emoji name>", "Aqua_Cry -- will send the custom emoji named \`Aqua_Cry\` on your behalf \n**This is an example please refer to your server emoji list for the correct name**")}

    async run(para) {
        const { message } = para;
        const { user } = para.bot;

        const emoji = await message.guild.emojis.cache.find(emoji => emoji.name.toLowerCase() === para.args[0].toLowerCase());

        if(!emoji){
            return message.channel.send(`**${message.author.username}**-sama, ${user.username} can't find any emoji called \`${para.args[0]}\` o (T ヘ To)`);
        }

        // send the message as the user
        const botMem = message.guild.member(user);
        const oldDisplayName = botMem.displayName;
        
        await botMem.setNickname(await message.guild.member(message.author).displayName);
        message.channel.send(`<${emoji.identifier}>`).then(msg => {
            message.delete();
            botMem.setNickname(oldDisplayName);
        });
    } // end of run
}; // end of module.exports