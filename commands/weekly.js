const Discord = require("discord.js");
const ms = require("parse-ms");
const { serverThumb } = require("../botconfig.json");
const userModel = require("../models/User");

module.exports.run = async (bot, message, args) => {
  //if (!message.content.startsWith(botconfig.prefix)) return;

  let user = message.author;
  const userDB = await userModel.findOne({
    ID: user.id,
    guildID: message.guild.id,
  });

  let embed = (message, color) => {
    return new Discord.MessageEmbed()
      .setColor(color)
      .setThumbnail(serverThumb)
      .setTimestamp(new Date())
      .setFooter(user.username, user.avatarURL())
      .setDescription(message);
  };

  let timeout = 604800000;
  let amount = 2500;

  let weekly = userDB.weekly;

  if (weekly !== null && timeout - (Date.now() - weekly) > 0) {
    let time = ms(timeout - (Date.now() - weekly));

    message.channel.send(
      embed(
        `**🎁 __ꜱᴇᴅᴍɪᴄɴɪ ʙᴏɴᴜꜱ__**\n\n👎︱Već ste pokupili svoj sedmični bonus.\n\n👉︱Vaš sljedeći sedmični bonus je za **${time.days} **dan/a **${time.hours} **sat/i **${time.minutes} **minut/a **${time.seconds} **sekund/i`,
        "#ff0000"
      )
    );
  } else {
    message.channel.send(
      embed(
        `**🎁 __ꜱᴇᴅᴍɪᴄɴɪ ʙᴏɴᴜꜱ__**\n\n👍︱Pokupili ste svoj sedmični bonus u iznosu od **${amount}€**`,
        "#80ff00"
      )
    );

    userDB.money += Number(amount);
    userDB.weekly = Date.now();
    userDB.save();
  }
};

module.exports.help = {
  name: "weekly",
  aliases: ["week"],
};
