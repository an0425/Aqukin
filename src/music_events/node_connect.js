/* this module represents the "nodeConnect" event for erela.js, emitted when a node connected to the Lavalink server */
const { Collection } = require("discord.js");
const BaseEvent = require("../utilities/structures/BaseEvent");

module.exports = class NodeConnectEvent extends BaseEvent {
	constructor() {super("nodeConnect");}
	
	async run (bot, node){
		console.log("new node connected");}
} // end of module.exports