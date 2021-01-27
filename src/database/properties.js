/* This module exports buffer memories property functions */
const { Users, Guilds, Media } = require("../database/dbObjects");

// This function defines all the property functions of bot.settings
module.exports = async function initProperties(bot){
    // set the prefix and other values
    Reflect.defineProperty(bot.settings, "setPrefix", {
        value: async function setPrefix(id, prefix, reply, react) {
            const guild = bot.settings.get(id);
            if (guild) {
                guild.prefix = prefix;
                guild.reply = reply;
                guild.react = react;
                return guild.save();
            }
            const newGuild = await Guilds.create({ guild_id: id, prefix: this.prefix, reply: this.reply, react: this.reply });
            bot.settings.set(id, newGuild);
            return newGuild;
        },
    });

    // toggle patreon status
    Reflect.defineProperty(bot.settings, "togglePatreon", {
        value: async function togglePatreon(id) {
            const guild = bot.settings.get(id);
            guild.patreon = !guild.patreon;
            return guild.save();
        },
    });

    // get a random element from the specified media array
    Reflect.defineProperty(bot.media, "getMedia", {
        value: async function getMedia(mediaType) {
            const media = await Media.findOne({ where: { id: 1 } });
            return media[mediaType][Math.floor(Math.random() * Math.floor(media[mediaType].length))]; 
        },
    });

    /* currency properties
    // add balance
    Reflect.defineProperty(bot.currency, "add", {
        value: async function add(id, amount) {
            const user = bot.currency.get(id);
            if (user) {
                user.balance += Number(amount);
                return user.save();
            }
            const newUser = await Users.create({ user_id: id, balance: amount });
            bot.currency.set(id, newUser);
            return newUser;
        },
    });
    
    // get balance
    Reflect.defineProperty(bot.currency, "getBalance", {
        value: function getBalance(id) {
            const user = bot.currency.get(id);
            return user ? user.balance : 0;
        },
    }); */
}
