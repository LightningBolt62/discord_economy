const Discord = require("discord.js");
const ms = require("parse-ms");
const { serverThumb, currency} = require("../botconfig.json");
const userModel = require("../models/User");

module.exports.run = async (bot, message, args) => {
  //if (!message.content.startsWith(botconfig.prefix)) return;

  let user = message.author;
  const userDB = await userModel.findOne({
    ID: user.id,
    guildID: message.guild.id,
  });

  let timeout = 180000;
  let amount = 100;

  let embed = (message, color) => {
    return new Discord.MessageEmbed()
      .setColor(color)
      .setTitle("🙏 **__𝙱𝚎𝚐𝚐𝚒𝚗𝚐__**")
      .setThumbnail(serverThumb)
      .setTimestamp()
      .setFooter(user.username, user.avatarURL())
      .setDescription(message);
  };

  if (userDB.beg !== null && timeout - (Date.now() - userDB.beg) > 0) {
    let time = ms(timeout - (Date.now() - userDB.beg));

    message.channel.send(
      embed(
        `**👎︱You already begged!**\n✋︱Try again in **${time.minutes}** minutes & **${time.seconds}** seconds`,
        "#ff0000"
      )
    );
  } else {
    message.channel.send(
      embed(`👍︱You begged for money and earned **${amount}${currency}**`, "#80ff00")
    );

    userDB.money += Number(amount);
    userDB.beg = Date.now();
    userDB.save();
  }
};

module.exports.help = {
  name: "beg",
  aliases: [""],
};
