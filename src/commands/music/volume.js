/* This module allows the author to configure the volume of Aqukin's audio stream  */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class VolumeCommand extends BaseCommand{
    constructor() {super("volume", ["setVolume"], "Set the volume of the audio stream", "ADMINISTRATOR", "music", true, false, "<a positive integer less than or equals to 200>")}
    
    async run(para){
        // shortcut variables
        const {message, player} = para;
        const {author, channel} = message;
        const num = Math.floor(para.args[0]);

        // checks if the input is a valid number or not
        if (isNaN(num)) return channel.send(`**${author.username}**-sama, that's not a valid number~`, para.ridingAqua);
        // checks if the author is trying to raise the volume above 200
        if (num > 200) return channel.send(`**${author.username}**-sama, please keep the volume at 200 or below as Aqukin is concerning about your health~`);
        // else checks if the author is trying to input a negative number
        else if (num < 0) return channel.send(`**${author.username}**-sama, Aqukin can't set the volume with a negative value`);           
        // set the volume
        player.setVolume(num);
        channel.send(`**${author.username}**-sama, Aqukin has set the volume to \`${player.volume}\``); // inform the author
    } // end of run
}; // end of module.exports



    
