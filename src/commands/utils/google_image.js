/* This module searches google for image(s) and sends them base on the given keyword */
require("dotenv").config();
const {google} = require("googleapis");
const customSearch = google.customsearch('v1');
const { MessageAttachment } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class SendCommand extends BaseCommand{
    constructor() {super("google", ["find", "search", "send"], "Search google for a random image based on the given keywords", "SEND_MESSAGES", "ultility", true, "<keywords>")}

    async run(para) {
        const author = para.message.author.username; // message's author username
        const channel = para.message.channel; // para.message.channel for short
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
        const image = new MessageAttachment(imageUrl);
        channel.send(`**${author}**-sama, here's your image result`, image);      
    } // end of run
}; // end of module.exports