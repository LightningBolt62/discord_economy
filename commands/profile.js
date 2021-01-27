const Discord = require("discord.js");
const { serverThumb } = require("../botconfig.json");
const userModel = require("../models/User");

module.exports.run = async (bot, message, args) => {
  //if (!message.content.startsWith(botconfig.prefix)) return;

  let user = message.mentions.members.first() || message.author;
  const userDB = await userModel.findOne({
    ID: user.id,
    guildID: message.guild.id,
  });
  let author = message.author;

  let embed = (message, color) => {
    return new Discord.MessageEmbed()
      .setColor(color)
      .setTitle("📊 __ꜱᴛᴀᴛɪꜱᴛɪᴋᴀ ᴘʀᴏꜰɪʟᴀ__")
      .setThumbnail("https://i.ibb.co/Bg64Sr5/Statistika.png")
      .setTimestamp(new Date())
      .setFooter(author.username, author.avatarURL())
      .setDescription(message);
  };

  let donator = userDB.rank || "None";

  message.channel.send(
    embed(
      `**Profil korisnika: ${user}** \n\n 💵︱**Džep:** ${userDB.money}€\n 💳︱**Bankovni račun:** ${userDB.bank}€\n 🏆︱**VIP Rank:**  ${donator}`,
      "#ffff00"
    )
  );
};

module.exports.help = {
  name: "profile",
  aliases: ["pro"],
};
