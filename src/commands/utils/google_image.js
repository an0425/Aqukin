/* This module searches google for image(s) and sends them base on the given keyword */
require("dotenv").config();
const {google} = require("googleapis");
const customSearch = google.customsearch('v1');
const { MessageAttachment } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class SendCommand extends BaseCommand{
    constructor() {super("google", ["find", "send", "search"], "Search google for a random image based on the given keywords", "SEND_MESSAGES", "ultility", true, false, "<keywords>")}

    async run(para) {
        const {message} = para;
        const query = para.args.join(" ");

        // search for the image
        const response = await customSearch.cse.list({
            auth: process.env.SEARCH_TOKEN,
            cx: process.env.SEARCH_ENGINE_ID,
            q: query,
            searchType: "image",
            num: 1
        });
        const imageUrl = response.data.items[0].link;
        message.channel.send(`**${message.author.username}**-sama, here's your image result`, new MessageAttachment(imageUrl));      
    } // end of run
}; // end of module.exports