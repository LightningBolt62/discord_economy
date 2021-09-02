const Discord = require("discord.js");
const { serverThumb, currency } = require("../botconfig.json");
const userModel = require("../models/User");

module.exports.run = async (bot, message, args, utils) => {
  //if (!message.content.startsWith(botconfig.prefix)) return;

  let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author;
  let author = message.author;
  const userDB = await userModel.findOne({
    ID: user.id,
    guildID: message.guild.id,
  });

  let embed = (message, color) => {
    return new Discord.MessageEmbed()
      .setColor(color)
      .setThumbnail(serverThumb)
      .setTimestamp()
      .setFooter(author.username, author.avatarURL())
      .setDescription(message);
  };

  message.channel.send(
    embed(
      `**✅ | ${user}'s balance**\n\n 💵︱**Wallet:** ${userDB.money}${currency}\n 💳︱**Bank:** ${userDB.bank}${currency}`,
      "#ffff00"
    )
  );
};

module.exports.help = {
  name: "balance",
  aliases: ["bal"],
};
