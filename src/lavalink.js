/* This module configures Lavalink with the necessary variables and then executes */
const fs = require("fs");
require("dotenv").config();


let application = fs.readFileSync("./application.yml","utf8")

if(process.env.PORT){
	application = application.replace("DYNAMICPORT", process.env.PORT)
}

if(process.env.PASSWORD){
	application = application.replace("youshallnotpass", process.env.PASSWORD)
}
fs.writeFileSync("./application.yml", application)

const spawn = require('child_process').spawn;
const child = spawn('java', ['-jar', 'Lavalink.jar'])

child.stdout.setEncoding('utf8')
child.stderr.setEncoding('utf8')

child.stdout.on('data',(data)=>{
	console.log(data);
});

child.stderr.on('data', (data) => {
  console.error(data);
});

child.on('error',(error)=>{
	console.error(error);
});

child.on('close', (code) => {
  console.log(`Lavalink exited with code ${code}`);
});