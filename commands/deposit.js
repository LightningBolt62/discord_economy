const Discord = require("discord.js");
const { serverThumb, currency} = require("../botconfig.json");
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
      .setThumbnail("https://i.ibb.co/WPS2KHY/Polaganje-Novca.png")
      .setTimestamp()
      .setFooter(user.username, user.avatarURL())
      .setDescription(message);
  };

  let money = userDB.money;

  if (args[0] == "all") {
    if (money === 0)
      return message.channel.send(
        embed(
          "\n👎︱You don't have any money to deposit!",
          "#ff0000"
        )
      );

    userDB.money -= Number(money);
    userDB.bank += Number(money);
    userDB.save();

    message.channel.send(
      embed(
        `\n👍︱You have successfully deposited ${money}${currency} in the bank!`,
        "#80ff00"
      )
    );
  } else {
    if (!args[0]) {
      return message.channel
        .send(
          embed(
            "\n✍️︱Enter the amount of money you want to deposit!",
            "#ffc83d"
          )
        )
        .catch((err) => console.log(err));
    }

    let numberPattern = new RegExp("^[0-9]+$<:>");
    if (!numberPattern.test(args[0])) {
      return message.channel.send(
        embed(
          `\n✍️︱Enter your quantity without any symbols or emojis!`,
          "#ffc83d"
        )
      );
    }

    if (money < args[0]) {
      return message.channel.send(embed("👎︱You don't have that much money to deposit!", "#ff0000"));
    }

    message.channel.send(
      embed(
        `\n👍︱Successfully deposited **${args[0]}${currency}** to your bank!`,
        "#80ff00"
      )
    );

    userDB.money -= Number(args[0]);
    userDB.bank += Number(args[0]);
    userDB.save();
  }

  let bankMoney = userDB.bank;
  let reachMoon = userDB.achievements.find((ach) => {
    return ach.name === "Reach for the Moon";
  });
  if (bankMoney >= "100000000" && !reachMoon) {
    userDB.achievements.push({ name: "Reach for the Moon", value: true });

    

    message.channel.send({
      embed: {
        title: `**ACHIEVEMENT UNLOCKED!**`,
        description: `🥳 **CONGRATULATIONS!** 🥳\n\n🏆 | You have more than ***100,000,000${currency}*** in your bank.\n🔓 | You unlocked the achievement "***Reach for the Moon***"`,
        color: 0x00ff00,
      },
    });
  }

  let reachSky = userDB.achievements.find((ach) => {
    return ach.name === "Reach for the Sky";
  });
  if (bankMoney >= "1000000000" && !reachSky) {
    userDB.achievements.push({ name: "Reach for the Sky", value: true });

    
    message.channel.send({
      embed: {
        title: `**ACHIEVEMENT UNLOCKED!**`,
        description: `🥳 **CONGRATULATIONS!** 🥳\n\n🏆 | You have more than ***1,000,000,000${currency}*** in your bank.\n🔓 | You unlocked the achievement "***Reach for the Sky***"`,
        color: 0x00ff00,
      },
    });
  }

  let reachStars = userDB.achievements.find((ach) => {
    return ach.name === "Reach for the Stars";
  });
  if (bankMoney >= "10000000000" && !reachStars) {
    userDB.achievements.push({ name: "Reach for the Stars", value: true });

    
    message.channel.send({
      embed: {
        title: `**ACHIEVEMENT UNLOCKED!**`,
        description: `🥳 **CONGRATULATIONS!** 🥳\n\n🏆 | You have more than ***10,000,000,000${currency}*** in your bank.\n🔓 | You unlocked the achievement "***Reach for the Stars***"`,
        color: 0x00ff00,
      },
    });
  }
};
module.exports.help = {
  name: "deposit",
  aliases: ["dep"],
};
