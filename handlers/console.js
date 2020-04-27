/* This module allows you send a text message through the console */
module.exports = (bot) => {
    let listener = process.openStdin();
    listener.addListener("data", res =>{
        let text = res.toString().trim().split(/ +/g);
        bot.channels.cache.get("623712309688401967").send(text.join(" "));
    })
};