const Discord = require("discord.js");
const { serverThumb } = require("../botconfig.json");
const userModel = require("../models/User");

module.exports.run = async (bot, message, args) => {
  //if (!message.content.startsWith(botconfig.prefix)) return;
  if (!message.member.hasPermission("ADMINISTRATOR")) return;

  let user = message.mentions.members.first() || message.author;
  let author = message.author;
  const userDB = await userModel.findOne({
    ID: user.id,
    guildID: message.guild.id,
  });

  let embed = (message, color) => {
    return new Discord.MessageEmbed()
      .setColor(color)
      .setTitle("📤 **__ᴏᴅᴜᴢɪᴍᴀɴᴊᴇ ɴᴏᴠᴄᴀ__**")
      .setThumbnail("https://i.ibb.co/k9dYQPM/Oduzimanje-Novca.png")
      .setTimestamp(new Date())
      .setFooter(author.username, author.avatarURL())
      .setDescription(message);
  };

  if (isNaN(args[1])) return;

  userDB.money -= args[1];
  userDB.save();

  message.channel.send(
    embed(
      `👍︱Oduzeli ste **${args[1]}€** korisniku **${user}** sa računa. \n\n 💵︱Novi iznos računa: **${userDB.money}€**`,
      "#ff0000"
    )
  );
};

module.exports.help = {
  name: "remove",
  aliases: ["rm"],
};
