/* this module represents the "command handler" */
const {readdirSync} = require("fs");

module.exports = (bot) => {
    const commandFiles = readdirSync("./commands").filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        bot.commands.set(command.name, command);
    }
};