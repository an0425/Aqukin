/* This module exports utilities functions */

// This function makes necessary checks and returns the valid number
async function checkNum(num, defaultNum){
    if(isNaN(num) || !num || num < 1){ // adjust the number to 1 if the number is invalid
        num = defaultNum;
    }
    else{ // else round the number
        num = Math.floor(num);
    }
    return num; // return the number
}

// This function convert true to yes, false to no
async function convertTF(value){
    if(value){ return "Yes"; }
    return "No";
}

module.exports = { checkNum, convertTF };