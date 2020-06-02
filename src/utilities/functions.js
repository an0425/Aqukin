/* This module exports utilities functions */

// This function makes necessary checks and returns the valid number
async function checkNum(num, defaultNum){
    if(isNaN(num) || !num || num < 1) { num = defaultNum; }  // adjust the number to 1 if the number is invalid
    else { num = Math.floor(num); } // else round the number
    return num; // return the number
}

// This function convert true to yes, false to no
async function convertTF(value){
    if(value) { return "Yes"; }
    return "No";
}

// This function convert video length from seconds format to minutes
async function convertLenght(value){
    let hours;
    let minutes;
    let seconds;
    let reply = "";
    if(!isNaN(value)) {
        value = await parseInt(value, 10);
        if (value >= 60){
            minutes = (value - value%60)/60;
            if (minutes >= 60){
                hours = (minutes - minutes%60)/60;
                minutes = minutes%60;
            }
        }
        seconds = value%60;
        
        if(hours != undefined){
            if(hours < 10){ hours = `0${hours}`; }
            reply += `${hours}h`;
        }
        if(minutes != undefined){
            if(minutes < 10){ minutes = `0${minutes}`; }
            reply += `${minutes}m`;
        }
        if(seconds != undefined){
            if(seconds < 10){ seconds = `0${seconds}`; }
            reply += `${seconds}s`;
        }
    }
    return reply;
}

module.exports = { checkNum, convertTF, convertLenght };