const Discord = require("discord.js");
const fetch = require('node-fetch');
const bot = new Discord.Client();
const prefix = "!";

var location_raw;
var location;
var data;
var url;
var country;
var settings = { method: "Get" };
var isRegion = false;
var isProvince = false;

var prov = require("./variables.js");

bot.login("Nzg0OTI3NzM3MDcyNDUxNjA1.X8wa6w.RyHcIhvAKoEsMhwH_AUZhX0Ggls");

bot.on("ready", () => {
    console.log("Logged in as " + bot.user.tag)
});

bot.on("message", (msg) => {
    words = msg.content.split(" "); //splits message into list by spaces
    if (words[0] === (prefix + "cases") && words.length > 1) {   //if !cases

        msg.react('✅'); // Confirm Commands
        location_raw = words.slice(1).join(" ");    //location = everything in the message after !cases

        //province
        for (var key in prov.prov) {
            if (location_raw.toLowerCase() === key) {
                location = prov.prov[key];
                isProvince = true;
            }
        }
        //canada regions
        for (var key in prov.regions) {
            if (location_raw.toLowerCase() === key) {
                location = prov.regions[key];
                isRegion = true;
            }
        }
        if (isRegion) {
            fetch("https://api.opencovid.ca/summary?loc=" + location, settings)
                .then(res => res.json())
                .then((json) => {
                    // do something with JSON
                    msg.channel.send("Active cases in (health region) " + location_raw.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ') + ": " + json.summary[0].cases);
                })
                .catch(function () { //Catching error message
                    msg.channel.send("Invalid location");
                });
        } else if (isProvince) {

            fetch("https://api.opencovid.ca/summary?loc=" + location, settings)
                .then(res => res.json())
                .then((json) => {
                    // do something with JSON
                    msg.channel.send("Active cases in " + location + ": " + json.summary[0].active_cases);
                })
                .catch(function () { //Catching error message
                    msg.channel.send("Invalid location");
                });

        } else {
            fetch("https://api.opencovid.ca/summary?loc=" + location_raw, settings)
                .then(res => res.json())
                .then((json) => {
                    // do something with JSON
                    msg.channel.send("Active cases in " + location_raw.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ') + ": " + json.summary[0].active_cases);
                })
                .catch(function () { //Catching error message
                    msg.channel.send("Invalid location");
                });
        }
        isRegion = false;
        isProvince = false;
    }


    //COVID TRACKING FOR CHANNEL

    if (words[0] === (prefix + "track") && words.length > 1) {
        setTimeout(function () {
            msg.channel.send()
            var dayMiliseconds = 1000 * 60 * 60 * 24
            setInterval(function () {
                msg.channel.send()
            }, dayMiliseconds)
        }, leftToEight())
    }






    // Command for listing contries

    if (msg.content.startsWith(prefix + 'countries')) {

        fetch("https://api.covid19api.com/countries")
            .then(res => res.json())
            .then((json) => {
                //do something
                msg.channel.send("```" + json + "```")

            })
            .catch(function () { //Error catch
                msg.channel.send("bork");
            });



        //REACTION PAGES SCROLL
        let pages = ['Countries 1', 'Countries 2', 'Countries 3']
        let page = 1;
        let embed = new Discord.MessageEmbed(data)
            .setColor("#ab15f1")
            .setFooter("Page " + page + " of " + String(pages.length))
            .setDescription(pages[page - 1])

        msg.channel.send(embed).then(msg => {

            msg.react('⬅️').then(r => {
                msg.react('➡️')
                const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅️' && user.id === msg.author.id;
                const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡️' && user.id === msg.author.id;

                const backwards = msg.createReactionCollector(backwardsFilter, { timer: 6000 });
                const forwards = msg.createReactionCollector(forwardsFilter, { timer: 6000 });

                backwards.on('collect', r => { //on backwards react
                    if (page === 1) { return };
                    page--
                    embed.setDescrption(pages[page - 1])
                    embed.setFooter("Page " + page + " of " + String(pages.length))
                    msg.edit(embed)

                    r.remove(r.users.backwardsFilter(u => u === msg.author).first());
                })

                forwards.on('collect', r => {
                    if (page === pages.length) return;
                    page++;
                    embed.setDescrption(pages[page - 1])
                    embed.setFooter("Page " + page + " of " + String(pages.length))
                    msg.edit(embed)

                    r.remove(r.users.backwardsFilter(u => u === msg.author).first());
                })
            })
        })
    }
})
