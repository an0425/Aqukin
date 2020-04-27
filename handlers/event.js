/* this module represents the "event handler" */
const {readdirSync} = require("fs");

module.exports = (bot) => {
    const events = readdirSync("./events").filter(file => file.endsWith(".js"));
    for (const file of events) {
        const event = require(`../events/${file}`);
        let eventName = file.split(".")[0];
        bot.on(eventName, event.bind(null, bot));
    }
};