/* this module represents the "nodeConnect" event for erela.js */
const BaseEvent = require("../utilities/structures/BaseEvent");

module.exports = class NodeConnectEvent extends BaseEvent {
	constructor() {
        super("nodeConnect");
	}
	
	async run (music, node){console.log("new node connected");}
} // end of module.exports