/* This module searches for a youtube channel and checks if whether or not they are live or will be live soon */
const {ytNotify} = require("../../utilities/artificial_intelligence/youtube_notification");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class LiveStatusCommand extends BaseCommand{
    constructor() {super("livestatus", ["ls", "live", "streaming"], "Check the live status of a youtube channel", "SEND_MESSAGES", "utility", true, false, "<channel name/URL>")}

    async run(para) {
        ytNotify(para);
    } // end of run
}; // end of module.exports