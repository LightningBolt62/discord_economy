const Discord = require("discord.js");
const { serverThumb, currency } = require("../botconfig.json");
const userModel = require("../models/User");

module.exports.run = async (bot, message, args) => {
  //if (!message.content.startsWith(botconfig.prefix)) return;

  let user = message.author;
  let embed = (message, color) => {
    return new Discord.MessageEmbed()
      .setColor(color)
      .setThumbnail(serverThumb)
      .setTitle(`Economy Leaderboard`)
      .setTimestamp()
      .setFooter(user.username, user.avatarURL())
      .setDescription(message);
  };

  if (!args[0])
    return message.channel.send(
      embed(
        `**Choose an option for displaying the leaderboard.**\n\nExample: ;leaderboard money/bank`,
        "#FFFFFF"
      )
    );

  let allData = await userModel.find();
  let money;
  let fields = [];

  switch (args[0]) {
    case "money":
      money = allData
        .filter((data) => {
          return data.money;
        })
        .sort((a, b) => {
          return Number(b.money) - Number(a.money);
        });

      fields = [];
      money.slice(0, 10).forEach(async (data) => {
        data.user = await bot.users.fetch(data.ID).then((userData) => {
          fields.push({
            name: userData.username,
            value: `${data.money} **${currency}**`,
          });
        });
      });

      setTimeout(() => {
        message.channel.send(
          embed(`TOP 10 Leaderboard (wallet)`, "#ffff00").addFields(fields)
        );
      }, 1000);
      break;

    case "bank":
      money = allData
        .filter((data) => {
          return data.bank;
        })
        .sort((a, b) => {
          return Number(b.bank) - Number(a.bank);
        });

      fields = [];
      money.slice(0, 10).forEach(async (data) => {
        data.user = await bot.users.fetch(data.ID).then((userData) => {
          fields.push({
            name: userData.username,
            value: `${data.bank} **${currency}**`,
          });
        });
      });

      setTimeout(() => {
        message.channel.send(
          embed(`TOP 10 Leaderboard (bank)`, "#ffff00").addFields(fields)
        );
      }, 1000);
      break;

    default:
      message.channel.send(
        embed(`**Choose an option for displaying the leaderboard.**\n\nExample: ;leaderboard money/bank`, "#ffff00")
      );
      break;
  }
};
module.exports.help = {
  name: "leaderboard",
  aliases: ["lb"],
};
