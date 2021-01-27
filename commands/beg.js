const Discord = require("discord.js");
const ms = require("parse-ms");
const { serverThumb } = require("../botconfig.json");
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
      .setTitle("🙏 **__ᴘʀᴏꜱᴇɴᴊᴇ__**")
      .setThumbnail(serverThumb)
      .setTimestamp(new Date())
      .setFooter(user.username, user.avatarURL())
      .setDescription(message);
  };

  if (userDB.beg !== null && timeout - (Date.now() - userDB.beg) > 0) {
    let time = ms(timeout - (Date.now() - userDB.beg));

    message.channel.send(
      embed(
        `**👎︱Već si prosio!**\n✋︱Pokušaj ponovo za **${time.minutes}** minut/a **${time.seconds}** sekund/i`,
        "#ff0000"
      )
    );
  } else {
    message.channel.send(
      embed(`👍︱Prosio si i zaradio si **${amount}$**`, "#80ff00")
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
