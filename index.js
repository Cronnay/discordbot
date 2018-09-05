const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');
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

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '!') {
        let args = message.substring(1).split(' ');
        const cmd = args[0];
       
        args = args.splice(1);
        // console.log(user);
        // console.log(userID);
        // console.log(evt);
        if (channelID === '486266838661988373') {
            switch(cmd.toLowerCase()) {
                case 'healer':
                    addToRole(userID, Healerid);
                    bot.sendMessage({
                        to: channelID,
                        message: `Set ${user} to healer`
                    });
                    removeMessage(evt.d.id, channelID);
                break;
                case 'tank':
                    addToRole(userID, Tankid);
                    bot.sendMessage({
                        to: channelID,
                        message: `Set ${user} to tank`
                    });
                    removeMessage(evt.d.id, channelID);
                break;
                case 'dps':
                    addToRole(userID, DPSid);
                    bot.sendMessage({
                        to: channelID,
                        message: `Set ${user} to dps`
                    });
                    removeMessage(evt.d.id, channelID);
                break;
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