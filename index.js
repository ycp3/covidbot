const Discord = require("discord.js");
const fetch = require('node-fetch');
const bot = new Discord.Client();
const prefix = "!covid";

var location;
var data;
var url;
var country;
var settings = { method: "Get" };

bot.login("Nzg0OTI3NzM3MDcyNDUxNjA1.X8wa6w.7UJMgnEMhrHxv2WJCeZTlok2VQA");

bot.on("ready", () => {
    console.log("Logged in as " + bot.user.tag)
});

bot.on("message", (msg) => {
    words = msg.content.split(" ");
    if (msg.content.startsWith(prefix));  {
    //if (words[0] === "!covid") {
        location = String(words[1]);
        url = "https://api.opencovid.ca/summary?loc=" + location;
        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                // do something with JSON
                msg.channel.send("active cases: " + json.summary[0].active_cases);
            });

    }
})



/*
//Covid Locational Tracker
bot.on('message', (message) => {
    //If [user] types !covid '
    if (msg.content.startsWith(prefix + 'track' + country))







} */
