const Discord = require("discord.js");
const ms = require("parse-ms");
const { serverThumb } = require("../botconfig.json");
const userModel = require("../models/User");

module.exports.run = async (bot, message, args) => {
  //if (!message.content.startsWith(botconfig.prefix)) return;

  let user = message.author;

  let timeout = 86400000;
  let amount = 1500;
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

  if (userDB.daily !== null && timeout - (Date.now() - userDB.daily) > 0) {
    let time = ms(timeout - (Date.now() - userDB.daily));

    message.channel.send(
      embed(
        `**🎁 __ᴅɴᴇᴠɴɪ ʙᴏɴᴜꜱ__**\n\n👎︱Već ste pokupili svoj dnevni bonus.\n\n👉︱Vaš sljedeći dnevni bonus je za **${time.hours} **sat/i **${time.minutes} **minut/a **${time.seconds} **sekund/i`,
        "#ff0000"
      )
    );
  } else {
    message.channel.send(
      embed(
        `**🎁 __ᴅɴᴇᴠɴɪ ʙᴏɴᴜꜱ__**\n\n👍︱Pokupili ste svoj dnevni bonus u iznosu od **${amount}€**`,
        "#80ff00"
      )
    );

    userDB.money += Number(amount);
    userDB.daily = Date.now();
    userDB.save();
  }
};

module.exports.help = {
  name: "daily",
  aliases: ["day"],
};
