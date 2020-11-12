/* this module represents the "nodeError" event for erela.js, emitted when there's an error with node connection to Lavalink server */
const BaseEvent = require('../../utilities/structures/BaseEvent');

module.exports = class NodeErrorEvent extends BaseEvent {
    constructor () {super("nodeError");}

    async run (bot, node, error) {
        console.log("An error has occured", error.message, node);
    } // end of run
} // end of module.exports