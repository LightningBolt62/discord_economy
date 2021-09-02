const Discord = require("discord.js");
const userModel = require("../models/User");
const { serverThumb } = require("../botconfig.json");

exports.run = async (bot, message, args) => {
  //if (!message.content.startsWith(botconfig.prefix)) return;
  if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You need to have the 'Administrator' permission to use this");

  let user = message.mentions.members.first() || message.author;
  let author = message.author;
  const userDB = await userModel.findOne({
    ID: user.id,
    guildID: message.guild.id,
  });

  if (isNaN(args[1])) return;
  userDB.money += Number(args[1]);
  userDB.save();

  let embed = (message, color) => {
    return new Discord.MessageEmbed()
      .setColor(color)
      .setThumbnail("https://i.ibb.co/vDDMYM5/Dodavanje-Novca.png")
      .setTitle("📥 **__ᴅᴏᴅᴀᴠᴀɴᴊᴇ ɴᴏᴠᴄᴀ__**")
      .setTimestamp(new Date())
      .setFooter(author.username, author.avatarURL())
      .setDescription(message);
  };

  message.channel.send(
    embed(
      `👍︱You added **${args[1]}€** to **${user}**.\n\n 💵︱They now have: **${userDB.money}€**`,
      "#ff0000"
    )
  );
};

module.exports.help = {
  name: "addmoney",
  aliases: ["addbal"],
};
