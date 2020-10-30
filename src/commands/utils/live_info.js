/* This module searches for a youtube channel and checks if whether or not they are live or will be live soon */
const {ytNotify} = require("../../utilities/artificial_intelligence/youtube_notification");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class LiveInfoCommand extends BaseCommand{
    constructor() {super("liveinfo", ["li", "live", "streaming"], "Check the live status of a youtube channel", "SEND_MESSAGES", "utility", true, "<channel name/URL>", "Aqua ch. -- will search youtube for the 1st channel matches the argument and display their live status")}

    async run(para) {
        ytNotify(para);
    } // end of run
}; // end of module.exports