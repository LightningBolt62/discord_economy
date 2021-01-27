const Discord = require("discord.js");
const { serverThumb } = require("../botconfig.json");
const userModel = require("../models/User");

module.exports.run = async (bot, message, args) => {
  //if (!message.content.startsWith(botconfig.prefix)) return;

  let user = message.author;
  const userDB = await userModel.findOne({
    ID: user.id,
    guildID: message.guild.id,
  });

  let embed = (message, color) => {
    return new Discord.MessageEmbed()
      .setColor(color)
      .setThumbnail("https://i.ibb.co/mRv4xVB/Podizanje-Novca.png")
      .setTimestamp(new Date())
      .setFooter(user.username, user.avatarURL())
      .setDescription(message);
  };

  let money = userDB.bank;

  if (args[0] == "all") {
    userDB.money += Number(money);
    userDB.bank -= Number(money);
    userDB.save();

    message.channel.send(
      embed(
        `\n**🏛 __ᴅɪᴀᴍᴏɴᴅ ʙᴀɴᴋᴀ__**\n\n👍︱Podigli ste sav svoj novac iz banke!`,
        "#80ff00"
      )
    );
  } else {
    if (!args[0]) {
      return message.channel.send(
        embed(
          `\n**🏛 __ᴅɪᴀᴍᴏɴᴅ ʙᴀɴᴋᴀ__**\n\n✍️︱Upišite količinu koju želite da podignete!`,
          "#ffff00"
        )
      );
    }

    let numberPattern = new RegExp("^[0-9]+$");
    if (!numberPattern.test(args[0])) {
      return message.channel.send(
        embed(
          `\n**💸 __ᴛʀᴀɴꜱꜰᴇʀ ɴᴏᴠᴄᴀ__**\n\n✍️︱Upišite vašu količinu bez simbola!`,
          "#ffc83d"
        )
      );
    }

    if (money < args[0]) {
      return message.channel.send(
        embed(
          `\n**🏛 __ᴅɪᴀᴍᴏɴᴅ ʙᴀɴᴋᴀ__**\n\n✋︱Nemate toliko novca!`,
          "#ff0000"
        )
      );
    }

    message.channel.send(
      embed(
        `\n**🏛 __ᴅɪᴀᴍᴏɴᴅ ʙᴀɴᴋᴀ__**\n\n👍︱Podigli ste **${args[0]}€** sa svog bankovnog računa!`,
        "#80ff00"
      )
    );

    userDB.money += Number(args[0]);
    userDB.bank -= Number(args[0]);
    userDB.save();
  }
};

module.exports.help = {
  name: "withdraw",
  aliases: ["wd"],
};
