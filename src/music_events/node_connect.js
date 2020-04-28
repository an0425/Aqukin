/* this module represents the "nodeConnect" event for erela.js */
const BaseEvent = require("../utils/structures/BaseEvent");

module.exports = class NodeConnectEvent extends BaseEvent {
	constructor() {
        super("nodeConnect");
	}
	
	async run (bot, node){
		// activities
		console.log("new node connected");
	}
}