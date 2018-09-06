const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');
const axios = require('axios');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
const bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
const serverId = '483610282573430798';
const DPSid = '486264140579602433';
const Healerid = '486264177388683294';
const Tankid= '486264205884784707';

const getRoleId = '486266838661988373';

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '!') {
        let args = message.substring(1).split(' ');
        const cmd = args[0]; //the command
       
        args = args.splice(1);
        // console.log(user);
        // console.log(userID);
        // console.log(evt);
        if (channelID === getRoleId) {
            switch(cmd.toLowerCase()) {
                case 'healer':
                    addToRole(userID, Healerid);
                    bot.sendMessage({
                        to: channelID,
                        message: `${user} fick rollen healer`
                    });
                    removeMessage(evt.d.id, channelID);
                break;
                case 'tank':
                    addToRole(userID, Tankid);
                    bot.sendMessage({
                        to: channelID,
                        message: `${user} fick rollen tank`
                    });
                    removeMessage(evt.d.id, channelID);
                break;
                case 'dps':
                    addToRole(userID, DPSid);
                    bot.sendMessage({
                        to: channelID,
                        message: `${user} fick rollen DPS`
                    });
                    removeMessage(evt.d.id, channelID);
                break;
             }
        } else {
            // console.log(args); //Array med argument efter !
            // console.log(evt); //Event. evt.d är data. object
            // console.log(user); // Username - sträng
            switch(cmd.toLowerCase()) {
                case 'raiderio':
                    if (args.length > 2) {
                        bot.sendMessage({
                            to: channelID,
                            message: 'För många argument. Skriv endast karaktärsnamn och servernamn. Ex: Noxtroz Tarren-mill'
                        });
                    } else if (args.length === 2) {
                        axios.get(`https://raider.io/api/v1/characters/profile?region=eu&realm=${args[1]}&name=${args[0]}&fields=gear%2Craid_progression%2Cmythic_plus_scores`)
                            .then(res => {
                                // console.log(res.data);
                                const { name, active_spec_name, realm, gear, raid_progression, mythic_plus_scores } = res.data;
                                const characterClass = res.data.class;
                                const mm = "\`\`\`";
                        const message = `
Namn: ${name},  
Aktiv spec: ${active_spec_name},  
Server: ${realm},  
Ilvl equipped: ${gear.item_level_equipped},  
Ilvl total: ${gear.item_level_total},  
Summering i Uldir: ${raid_progression.uldir.summary},  
Mythic plus score: ${mythic_plus_scores.all} 
                                `;
                                bot.sendMessage({
                                    to: userID,
                                    message: message
                                })
                            });
                    } else {
                        bot.sendMessage({
                            to: channelID,
                            message: 'För få argument. Skriv karaktärsnamn och servernamn. Ex: Noxtroz Tarren-mill'
                        });
                    }
                break;
                case 'affixes':
                    axios.get('https://raider.io/api/v1/mythic-plus/affixes?region=eu&locale=en')
                    .then(res => {
                        bot.sendMessage({
                            to: channelID,
                            message: `Den här veckan är det ${res.data.title}`
                        });     
                    });
                break;
                case 'hjälp':
                case 'help':
                case 'h':
                    bot.sendMessage({
                        to: channelID,
                        message: `\`!raiderio karatär server\` för att få info om den karaktären ifrån Raider.io.
För att få en roll, gå till #get-role och skriv \`!tank eller !healer eller !dps\`
För att se affixes för den här veckan skriv \`!affixes\`
                        `
                    });
                break;
                default:
                    bot.sendMessage({
                        to: userID,
                        message: `Känner inte till kommandot. Skriv !help, !h eller !hjälp för att få reda på alla kommandon`
                    });
            }
        }
     }
});

function addToRole(userID, role) {
    bot.addToRole({
        serverID: serverId,
        userID: userID,
        roleID: role
    })
}

function removeMessage(messageID, channelID) {
    bot.deleteMessage({
        channelID: channelID,
        messageID: messageID
    });
}