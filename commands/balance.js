const Discord = require("discord.js");
const { serverThumb } = require("../botconfig.json");
const userModel = require("../models/User");

module.exports.run = async (bot, message, args, utils) => {
  //if (!message.content.startsWith(botconfig.prefix)) return;

  let user = message.mentions.members.first() || message.author;
  let author = message.author;
  const userDB = await userModel.findOne({
    ID: user.id,
    guildID: message.guild.id,
  });

  let embed = (message, color) => {
    return new Discord.MessageEmbed()
      .setColor(color)
      .setThumbnail(serverThumb)
      .setTimestamp(new Date())
      .setFooter(author.username, author.avatarURL())
      .setDescription(message);
  };

  message.channel.send(
    embed(
      `**✅︱Novčano stanje korisnika: ${user}**\n\n 💵︱**Džep:** ${userDB.money}€\n 💳︱**Bankovni račun:** ${userDB.bank}€`,
      "#ffff00"
    )
  );
};

module.exports.help = {
  name: "balance",
  aliases: ["bal"],
};
