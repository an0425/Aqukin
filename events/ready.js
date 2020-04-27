/* this module represents the "ready" event */
const activities = ["Apex Legends", "Minecraft", "Sekiro: Shadows Die Twice", "Super Smash Bros. Ultimate", "Dark Souls III"]

module.exports = bot => {
    console.log("Ninja Combat Maido is now ready at your service, master!")
    const i = Math.floor(Math.random() * Math.floor(activities.length)); 
    bot.user.setActivity(activities[i], { type: "PLAYING" }).catch(console.error);
}