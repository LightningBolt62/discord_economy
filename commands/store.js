const Discord = require("discord.js");
const { serverThumb } = require("../botconfig.json");
const { ranks, colors } = require("../configs/shop.config");

module.exports.run = async (bot, message, args) => {
  //if (!message.content.startsWith(botconfig.prefix)) return;

  let user = message.author;
  let embed = (message, color) => {
    return new Discord.MessageEmbed()
      .setColor(color)
      .setThumbnail("https://i.ibb.co/4NnL5PQ/Market.png")
      .setTitle("**🛒 __ɪᴛᴇᴍ ꜱʜᴏᴘ__**")
      .setTimestamp(new Date())
      .setFooter(user.username, user.avatarURL())
      .setDescription(message);
  };

  const arrayToString = (array) => {
    return array
      .map((item) => {
        return `${item.icon} ${item.name} **${item.price}**€`;
      })
      .join("\n");
  };

  let eMessage = `**👉 Rankovi:**\n${arrayToString(ranks)}\n
  **👉 Boje:**\n${arrayToString(colors)}`;
  message.channel.send(embed(eMessage, "#4b7bec"));
};

module.exports.help = {
  name: "store",
  aliases: ["st"],
};
