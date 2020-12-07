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
var isProvince = false;
var isRegion = false;
var prov = require("./variables.js");

bot.login("YOUR_BOT_TOKEN");

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
        for (var key in prov.regions) {
            if (location_raw.toLowerCase() === key) {
                location = prov.regions[key];
                isRegion = true;
            }
        }



        if (isProvince) {

            fetch("https://api.opencovid.ca/summary?loc=" + location, settings)
                .then(res => res.json())
                .then((json) => {
                    // do something with JSON
                    //START OF EMBED
                    const casesEmbed = new Discord.MessageEmbed()
                        .setColor('#ab15f1')
                        .setTitle('COVID-19 Statistics')
                        //	.setURL('https://discord.js.org/')
                        .setAuthor('HackCamp Nooblords', 'https://i.imgur.com/e9ALu9R.png')//, 'https://discord.js.org'*/)
                        .setDescription('COVID-19 in ' + location)
                        .setThumbnail('https://i.imgur.com/czBOobl.png')
                        .addFields(
                            { name: "Total Active Cases: ", value: json.summary[0].active_cases },
                            //{ name: '\u200B', value: '\u200B' },
                            { name: "New Cases: ", value: json.summary[0].cases, inline: true },
                            { name: "Deaths Today: ", value: json.summary[0].deaths, inline: true },
                            { name: "Recovered Today: ", value: json.summary[0].recovered, inline: true },
                            //{ name: '\u200B', value: '\u200B' },
                            { name: "Cumulative Cases: ", value: json.summary[0].cumulative_cases, inline: true },
                            { name: "Cumulative Deaths: ", value: json.summary[0].cumulative_deaths, inline: true },
                            { name: "Cumulative Recovered: ", value: json.summary[0].cumulative_recovered, inline: true },
                            //{ name: '\u200B', value: '\u200B' },
                            { name: "Tested Today: ", value: json.summary[0].testing, inline: true },
                            { name: "Cumulative Testing: ", value: json.summary[0].cumulative_testing, inline: true },
                            { name: "Net Change: ", value: json.summary[0].active_cases_change, inline: true })
                        //.setImage('https://i.imgur.com/ljwubJw.png')
                        .setTimestamp()
                        .setFooter('Data recieved on: ' + json.summary[0].date, 'https://i.imgur.com/v1dWZCo.png');


                    /*
                                            "**" + location + "**\nTotal Active Cases: " + json.summary[0].active_cases +
                                            "\n\nNew Cases (Since last recording): " + json.summary[0].cases +
                                            "\nDeaths Today: " + json.summary[0].deaths +
                                            "\nRecovered Today: " + json.summary[0].recovered +
                                            "\n\nCumulative Cases: " + json.summary[0].cumulative_cases +
                                            "\nCumulative Deaths: " + json.summary[0].cumulative_deaths +
                                            "\nCumulative Recovered: " + json.summary[0].cumulative_recovered +
                                            "\n\nTested Today: " + json.summary[0].testing +
                                            "\nCumulative Testing: " + json.summary[0].cumulative_testing +
                                            "\nNet Change (+- From last recording): " + json.summary[0].active_cases_change +
                                            "\n\nRecorded Date: " + json.summary[0].date)
                                            
                    */

                    msg.channel.send(casesEmbed);
                })
                .catch(function () { //Catching error message
                    msg.channel.send("Invalid location");
                });
        } else if (isRegion) {
            fetch("https://api.opencovid.ca/summary?loc=" + location, settings)
                .then(res => res.json())
                .then((json) => {
                    // do something with JSON
                    //START OF EMBED
                    const casesEmbed = new Discord.MessageEmbed()
                        .setColor('#ab15f1')
                        .setTitle('COVID-19 Statistics')
                        //	.setURL('https://discord.js.org/')
                        .setAuthor('HackCamp Nooblords', 'https://i.imgur.com/e9ALu9R.png')//, 'https://discord.js.org'*/)
                        .setDescription('COVID-19 in Health Region ' + location_raw.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '))
                        .setThumbnail('https://i.imgur.com/czBOobl.png')
                        .addFields(
                            { name: "New Cases Today: ", value: json.summary[0].cases },
                            //{ name: '\u200B', value: '\u200B' },
                            //{ name: "New Cases: ", value: json.summary[0].cases, inline: true  },
                            { name: "Deaths Today: ", value: json.summary[0].deaths },
                            //{ name: "Recovered Today: ", value: json.summary[0].recovered, inline: true  },
                            //{ name: '\u200B', value: '\u200B' },
                            { name: "Cumulative Cases: ", value: json.summary[0].cumulative_cases, inline: true },
                            { name: "Cumulative Deaths: ", value: json.summary[0].cumulative_deaths, inline: true })
                            //{ name: "Cumulative Recovered: ", value: json.summary[0].cumulative_recovered, inline: true  },
                            //{ name: '\u200B', value: '\u200B' },
                            //{ name: "Tested Today: ", value: json.summary[0].testing , inline: true },
                            //{ name: "Cumulative Testing: ", value: json.summary[0].cumulative_testing, inline: true  },
                            //{ name: "Net Change: ", value: json.summary[0].active_cases_change, inline: true  })
                        //.setImage('https://i.imgur.com/ljwubJw.png')
                        .setTimestamp()
                        .setFooter('Data recieved on: ' + json.summary[0].date, 'https://i.imgur.com/v1dWZCo.png');
                    msg.channel.send(casesEmbed);
                })
                .catch(function () { //Catching error message
                    msg.channel.send("Invalid location");
                });
        } else {
            fetch("https://api.opencovid.ca/summary?loc=" + location_raw, settings)
                .then(res => res.json())
                .then((json) => {
                    // do something with JSON
                    const casesEmbed = new Discord.MessageEmbed()
                        .setColor('#ab15f1')
                        .setTitle('COVID-19 Statistics')
                        //	.setURL('https://discord.js.org/')
                        .setAuthor('HackCamp Nooblords', 'https://i.imgur.com/e9ALu9R.png')//, 'https://discord.js.org'*/)
                        .setDescription('COVID-19 in ' + location_raw.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '))
                        .setThumbnail('https://i.imgur.com/czBOobl.png')
                        .addFields(
                            { name: "Total Active Cases: ", value: json.summary[0].active_cases },
                            //{ name: '\u200B', value: '\u200B' },
                            { name: "New Cases: ", value: json.summary[0].cases, inline: true },
                            { name: "Deaths Today: ", value: json.summary[0].deaths, inline: true },
                            { name: "Recovered Today: ", value: json.summary[0].recovered, inline: true },
                            //{ name: '\u200B', value: '\u200B' },
                            { name: "Cumulative Cases: ", value: json.summary[0].cumulative_cases, inline: true },
                            { name: "Cumulative Deaths: ", value: json.summary[0].cumulative_deaths, inline: true },
                            { name: "Cumulative Recovered: ", value: json.summary[0].cumulative_recovered, inline: true },
                            //{ name: '\u200B', value: '\u200B' },
                            { name: "Tested Today: ", value: json.summary[0].testing, inline: true },
                            { name: "Cumulative Testing: ", value: json.summary[0].cumulative_testing, inline: true },
                            { name: "Net Change: ", value: json.summary[0].active_cases_change, inline: true })
                        //.setImage('https://i.imgur.com/ljwubJw.png')
                        .setTimestamp()
                        .setFooter('Data recieved on: ' + json.summary[0].date, 'https://i.imgur.com/v1dWZCo.png');
                    msg.channel.send(casesEmbed); /*
                    "**" + location_raw.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ') + "**\nTotal Active Cases: " + json.summary[0].active_cases +
                        "\n\nNew Cases (Since last recording): " + json.summary[0].cases +
                        "\nDeaths Today: " + json.summary[0].deaths +
                        "\nRecovered Today: " + json.summary[0].recovered +
                        "\n\nCumulative Cases: " + json.summary[0].cumulative_cases +
                        "\nCumulative Deaths: " + json.summary[0].cumulative_deaths +
                        "\nCumulative Recovered: " + json.summary[0].cumulative_recovered +
                        "\n\nTested Today: " + json.summary[0].testing +
                        "\nCumulative Testing: " + json.summary[0].cumulative_testing +
                        "\nNet Change (+- From last recording): " + json.summary[0].active_cases_change +
                        "\n\nRecorded Date: " + json.summary[0].date); */
                })
                .catch(function () { //Catching error message
                    msg.channel.send("Invalid location");
                });
        }
        isProvince = false;
        inRegion = false;
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
        //REACTION PAGES SCROLL
        let pages = ['Countries 1', 'Countries 2', 'Countries 3']
        let page = 1;
        let embed = new Discord.MessageEmbed()
            .setColor("#ab15f1")
            .setFooter("Page " + page + " of " + String(pages.length))
            .setDescription(pages[page - 1])

        msg.channel.send(embed).then(msg => {
            msg.react('⬅️').then(r => {
                msg.react('➡️')
                const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅️' && user.id === msg.author.id;
                const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡️' && user.id === msg.author.id;

                const backwards = msg.createReactionCollector(backwardsFilter, { timer: 1000 });
                const forwards = msg.createReactionCollector(forwardsFilter, { timer: 1000 });

                backwards.on('collect', r => { //on backwards react
                    if (page === 1) { return };
                    page--
                    embed.setDescription(pages[page - 1])
                    embed.setFooter("Page " + page + " of " + String(pages.length))
                    msg.edit(embed)

                })

                forwards.on('collect', r => {
                    if (page === pages.length) return;
                    page++;
                    embed.setDescription(pages[page - 1])
                    embed.setFooter("Page " + page + " of " + String(pages.length))
                    msg.edit(embed)

                })
            })
        })
    }
})
