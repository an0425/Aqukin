/* This module exports buffer memories property functions */
const { Users, Guilds, Media } = require("../database/dbObjects");

// This function defines all the property functions of bot.settings
module.exports = async function initProperties(bot){
    // define random function for array
    Array.prototype.random = function () {
        return this[Math.floor((Math.random()*this.length))];
    }

    // standard deviation calculator
    Array.prototype.standardDeviation = async function (){
        const n = this.length
        const mean = this.reduce((a, b) => a + b) / n
        return Math.sqrt(this.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
    }
    
    // set the prefix and other values
    Reflect.defineProperty(bot.settings, "setPrefix", {
        value: async function setPrefix(id, prefix, defaultBool) {
            const guild = bot.settings.get(id);
            if (guild) {
                guild.prefix = prefix;
                guild.reply = reply;
                guild.react = react;
                return guild.save();
            }
            const newGuild = await Guilds.create({ guild_id: id, prefix: this.prefix, reply: defaultBool, react: defaultBool });
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
            return media[mediaType].random(); 
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
