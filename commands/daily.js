const Discord = require("discord.js");
const ms = require("parse-ms");
const { serverThumb, currency } = require("../botconfig.json");
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
      .setTimestamp()
      .setFooter(user.username, user.avatarURL())
      .setDescription(message);
  };

  if (userDB.daily !== null && timeout - (Date.now() - userDB.daily) > 0) {
    let time = ms(timeout - (Date.now() - userDB.daily));

    message.channel.send(
      embed(
        `**👎︱You have already claimed your daily reward.\n\n👉︱Come back again in **${time.hours} **hours, **${time.minutes} **minutes and **${time.seconds} **seconds to claim your next reward.`,
        "#ff0000"
      )
    );
  } else {
    message.channel.send(
      embed(
        `**🎁 __𝙳𝚊𝚒𝚕𝚢 𝚁𝚎𝚠𝚊𝚛𝚍__**\n\n👍︱You have successfully claimed your daily reward of **${amount}${currency}**`,
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
