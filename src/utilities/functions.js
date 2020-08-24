/* This module exports utilities functions */

// This function makes necessary checks and returns the valid number
function checkNum(num, defaultNum, range, round){
    // adjust the number to 1 if the number is invalid
    if(isNaN(num) || !num || num < range) { num = defaultNum; } 
    // else round the number if needed
    else { num = round ? Math.floor(num) : num; } 

    return num; 
}

// This function convert true to yes, false to no
function convertBoolean(value){
    let reply = value ? "Yes peko" : "No dan";
    return reply;
}

// This function format numbers (seconds) to hh:mm:ss format
async function formatLength(value, seeking){
    let hours = -1;
    let minutes = -1;
    let seconds;
    let reply = "";
    
    // Checks if the value is a valid number
    if(!isNaN(value)) {
        value = parseInt(value, 10);

        // Checks if the value is equal to 0
        if(value === 0){
            reply += seeking ? "Start" : "Live";
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
            
            if(hours >= 0){
                hours = hours < 10 ? `0${hours}` : hours; 
                reply += `${hours}:`;
            }
            if(minutes >= 0){
                minutes = minutes < 10 ? `0${minutes}` : minutes; 
                reply += `${minutes}:`;
            }
            seconds = seconds < 10 ? `0${seconds}` : seconds; 
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
    total = (total < 0 || isNaN(total)) ? 0 : total;
    return total;
}

module.exports = { checkNum, convertBoolean, formatLength, convertInput };