/* this module represents the "nodeError" event for erela.js */
const BaseEvent = require('../utils/structures/BaseEvent');

module.exports = class NodeErrorEvent extends BaseEvent {
  constructor () {
    super("nodeError");
  }

  async run (client, node, err) {
    console.log("An error has occured");
    console.log(err.message);
  }
}