/* This module allows the author to stop Aqukin current audio streaming and disconnect her from the voice channel */
const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class StopCommand extends BaseCommand{
    constructor() {super("stop",["disconnect", "dc", "leave"], "ADMINISTRATOR", "music", false, false, "")}

    async run (para) {
      const { id } = para.message.guild;
      para.bot.music.players.destroy(id);
    }
};


    
