/* this module represents the "nodeDisconnect" event for erela.js, emitted when a node connected to the Lavalink server */
const BaseEvent = require("../utilities/structures/BaseEvent");

module.exports = class NodeDisconnectEvent extends BaseEvent {
	constructor() {super("nodeDisconnect");}
	
	async run (music, node, error){
		await console.log("A node has been disconnected", error.message, node);
		await node.connect(); // retry connection
		node.destroy(); // destroy the node if failed to retry
	}
} // end of module.exports