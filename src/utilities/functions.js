/* This module exports utilities functions */

// This function makes necessary checks and returns the valid number
async function checkNum(num, defaultNum, range, round){
    if(isNaN(num) || !num || num < range) { num = defaultNum; }  // adjust the number to 1 if the number is invalid
    else { 
        if(round) { num = Math.floor(num); }
    } // else round the number
    return num; // return the number
}

// This function convert true to yes, false to no
async function convertTF(value){
    if(value) { return "Yes Peko"; }
    return "No Dan";
}

// This function format numbers (seconds) to hh:mm:ss format
async function formatLength(value){
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
            //if(hours < 10){ hours = `0${hours}`; }
            reply += `${hours}:`;
        }
        if(minutes != undefined){
            //if(minutes < 10){ minutes = `0${minutes}`; }
            reply += `${minutes}:`;
        }
        if(seconds != undefined){
            //(seconds < 10){ seconds = `0${seconds}`; }
            reply += `${seconds}`;
        }
    }
    return reply;
}

// This function convert video length from seconds format to minutes
async function convertInput(value){
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    value = value.trim().split(":");
    await value.forEach(i => { i = parseInt(i); });
    let total;

    switch(value.length){
        case 3:
            hours = parseInt(value[0]*3600);
            minutes = parseInt(value[1]*60);
            seconds = parseInt(value[2]);
            break;
        case 2:
            minutes = parseInt(value[0]*60);
            seconds = parseInt(value[1]);
            break;
        case 1:
            seconds = parseInt(value[0]);
            break;
    }
    total = hours + minutes + seconds;
    if(total < 0 || isNaN(total)) { total = 0; }
    return total;
}

module.exports = { checkNum, convertTF, formatLength, convertInput };