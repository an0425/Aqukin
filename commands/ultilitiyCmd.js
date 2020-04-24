const Discord = require("discord.js")
const { Client, MessageAttachment } = require("discord.js");

module.exports = {
    name: "ultilityCmd",
    description: "Aqukin main script for ultilities commands",

    /* This function cleans up the specified number of text */
    cleanUp(message, args) {
        // checks if the input is null or not
        if (!args[1]) return message.channel.send(`${message.author.username}-sama, please also input the number (maximum 99) of messages that you would like Aqukin to clean up!`);
        // checks if the input is a valid number or not
        if (isNaN(args[1])) return message.channel.send(`${message.author.username}-sama, that's not a valid number :(`);
        // checks if the input is more than 99
        if(parseInt(args[1])>99) return message.channel.send(`${message.author.username}-sama, Aqukin can only delete a maximum of 99 messages only :(`);
        // checks if the author has administrative permission
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`I'm sorry ${message.author.username}-sama, but it seems like you don't have the permission to use this command :(`);

        message.channel.bulkDelete(parseInt(args[1])+1)
            .then(console.log)
            .catch(console.error);
    },

    /* This function embeds the mentioned user into an embed then display it */
    info(message) {
        const user = message.mentions.users.first(); // get the mentioned user
        if (user) { // if they are mentioned
            const member = message.guild.member(user); // get the mention user via the guild member list
            if (member) { // if they are in the server
                const embed = new Discord.MessageEmbed()
                    .setTitle(`This is ${member.displayName}-sama information`)
                    .setColor(0x1DE2FE)
                    .addField("Username ", member.user.username, true)
                    .addField("Nickname ", member.nickname, true)
                    .setImage(member.user.displayAvatarURL())
                message.channel.send(embed)
                    .then(console.log)
                    .catch(console.error);
            } else // else they are not in the server
                message.channel.send(`${message.author.user}-sama, it looks like the person you mentioned isn't in this server :(`);
        } else // if the author did not mention anyone
            message.channel.send(`${message.author.user}-sama, please also mention the user the whom you would like to get their info.`);
    },

    /* This function fetch and display randomly one of the two Aqua dogeza pictures */
    dogeza(message) {
        const attachment = new MessageAttachment("pictures/dogeza_1.jpg")
        message.channel.send("Oose no mama ni! (As you will, sir!)", attachment);
    },

    /* This method search and send an attachment base on the keyword */
    send(message) {
        const attachment = new MessageAttachment("https://external-preview.redd.it/SglFSnWQU3ihr0s3ANQMtsPbETyHNQX0wJeZrKt7WAc.jpg?auto=webp&s=c96bf123a5e8a2b9bf1bd22b0cc5a7374ed3820a");
        message.channel.send(attachment);
    },

    /* Main function for script execution */
    execute(message, args) {
        switch (args[0].toLowerCase()) {
            /* Delete message */
            case "delete":
            case "clean":
                this.cleanUp(message, args);
                break;

            /* Embed */
            case "info":
                this.info(message, args);
                break;

            /* Search and send picture attachment */
            case "send":
                this.send(message);
                break;

            /* Dogeza */
            case "dogeza":
                this.dogeza(message);
                break;
        }
    }
}