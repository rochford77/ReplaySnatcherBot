const Discord = require('discord.js')
const client = new Discord.Client()
const https = require('https');
const fs = require('fs');

client.on('ready', () => {
    console.log("Connected as " + client.user.tag)
})

client.on('message', (receivedMessage) => {

    if (receivedMessage.author == client.user) {
        return
    }

    const year = getYearNum()
    const week = getNumberOfWeek()
    const chan = receivedMessage.channel.name
    const server = receivedMessage.guild.name
    const directory = validateDirectoryTree(server, chan, week, year)

    if(receivedMessage.attachments.first()){
        if(receivedMessage.attachments.first().filename.indexOf('.replay') !== -1){

            const file = fs.createWriteStream(directory + "/" + receivedMessage.author.username + "_" + receivedMessage.attachments.first().filename);
            const request = https.get(receivedMessage.attachments.first().url, function(response) {
                response.pipe(file);
            });
            receivedMessage.channel.send(getRandomResponse())
        }else{
            receivedMessage.delete()
        }
    }else{
        receivedMessage.delete()
    }
})

function validateDirectoryTree(server, channel, week, year){
    var replayDir = createDirIfNotExists("replays")
    var serverDir = createDirIfNotExists(replayDir + "/" + server)
    var channelDir = createDirIfNotExists(serverDir + "/" + channel)
    var weekDir = createDirIfNotExists(channelDir + "/" + "week_" + week + "_" + year)
    return weekDir
}
function createDirIfNotExists(dir){

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    return dir
}

function getYearNum(){
    const today = new Date()
    return today.getFullYear()
}
function getNumberOfWeek() {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function getRandomResponse(){
    var message = ""
    switch(randomIntFromInterval(1, 5)){
        case 1:
            message  = "Got it.";
            break;
        case 2:
            message  = "Thanks!";
            break;
        case 3:
            message  = "Mouse Rat will love this.";
            break;
        case 4:
            message  = "Squishy, is that you?";
            break;
        case 5:
            message  = "Thx bae";
            break;
    }
    return message;
}

function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
bot_secret_token = ""

client.login(bot_secret_token)