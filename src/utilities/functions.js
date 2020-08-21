/* This module exports utilities functions */

// This function makes necessary checks and returns the valid number
function checkNum(num, defaultNum, range, round){
    if(isNaN(num) || !num || num < range) { num = defaultNum; }  // adjust the number to 1 if the number is invalid
    else { 
        if(round) { num = Math.floor(num); }
    } // else round the number
    return num; // return the number
}

// This function convert true to yes, false to no
function convertBoolean(value){
    if(value) { return "Yes peko"; }
    return "No dan";
}

// This function format numbers (seconds) to hh:mm:ss format
function formatLength(value, seeking){
    let hours;
    let minutes;
    let seconds;
    let reply = "";
    
    // Checks if the value is a valid number
    if(!isNaN(value)) {
        value = parseInt(value, 10);

        // Checks if the value is equal to 0
        if(value === 0){
            if(seeking){
                reply += "Start";
            }
            else{
                reply += "Live";
            }
        }
        // Else the value is greater than 0
        else{
            if (value >= 60){
                minutes = (value - value%60)/60;
                if (minutes >= 60){
                    hours = (minutes - minutes%60)/60;
                    minutes = minutes%60;
                }
            }
            seconds = value%60 || 0;
            
            if(hours){
                if(hours < 10){ hours = `0${hours}`; }
                reply += `${hours}:`;
            }
            if(minutes){
                if(minutes < 10){ minutes = `0${minutes}`; }
                reply += `${minutes}:`;
            }
            if(seconds < 10){ seconds = `0${seconds}`; }
            reply += `${seconds}`;
        } // End of else the value is greater than 0
    } // End of if the value is a valid number

    return reply;
}

// This function convert video length from seconds format to minutes
function convertInput(value){
    let total;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if(value){
        value = value.trim().split(":");
        value.forEach(i => { i = parseInt(i); });
        
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
    }
    
    total = hours + minutes + seconds;
    if(total < 0 || isNaN(total)) { total = 0; }
    return total;
}

module.exports = { checkNum, convertBoolean, formatLength, convertInput };