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
      .setThumbnail("https://i.ibb.co/WPS2KHY/Polaganje-Novca.png")
      .setTimestamp(new Date())
      .setFooter(user.username, user.avatarURL())
      .setDescription(message);
  };

  let money = userDB.money;

  if (args[0] == "all") {
    if (money === 0)
      return message.channel.send(
        embed(
          "\n**🏛 __ᴅɪᴀᴍᴏɴᴅ ʙᴀɴᴋᴀ__**\n\n👎︱Nemate dovoljno novca za polog!",
          "#ff0000"
        )
      );

    userDB.money -= Number(money);
    userDB.bank += Number(money);
    userDB.save();

    message.channel.send(
      embed(
        "\n**🏛 __ᴅɪᴀᴍᴏɴᴅ ʙᴀɴᴋᴀ__**\n\n👍︱Uspješno ste položili sav svoj novac u banku!",
        "#80ff00"
      )
    );
  } else {
    if (!args[0]) {
      return message.channel
        .send(
          embed(
            "\n**🏛 __ᴅɪᴀᴍᴏɴᴅ ʙᴀɴᴋᴀ__**\n\n✍️︱Upišite količinu koju želite da položite!",
            "#ffc83d"
          )
        )
        .catch((err) => console.log(err));
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
      return message.channel.send(embed("👎︱Nemate toliko novca!", "#ff0000"));
    }

    message.channel.send(
      embed(
        `\n**🏛 __ᴅɪᴀᴍᴏɴᴅ ʙᴀɴᴋᴀ__**\n\n👍︱Uspješno ste položili **${args[0]}$** u banku!`,
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

    role = message.guild.roles.cache.find((r) => r.id === "799300357553127445");
    message.guild.members.cache.get(user.id).roles.add(role);

    message.channel.send({
      embed: {
        title: `**NOVO DOSTIGNUĆE!**`,
        description: `🥳 **ČESTITAMO TI!** 🥳\n\n🏆 | Imas više od ***100.000.000€*** na banci.\n🔓 | Otključao si "***Reach for the Moon***"`,
        color: 0x00ff00,
      },
    });
  }

  let reachSky = userDB.achievements.find((ach) => {
    return ach.name === "Reach for the Sky";
  });
  if (bankMoney >= "1000000000" && !reachSky) {
    userDB.achievements.push({ name: "Reach for the Sky", value: true });

    role = message.guild.roles.cache.find((r) => r.id === "799301358208942081");
    message.guild.members.cache.get(user.id).roles.add(role);

    message.channel.send({
      embed: {
        title: `**NOVO DOSTIGNUĆE!**`,
        description: `🥳 **ČESTITAMO TI!** 🥳\n\n🏆 | Imas više od ***1.000.000.000€*** na banci.\n🔓 | Otključao si "***Reach for the Sky***"`,
        color: 0x00ff00,
      },
    });
  }

  let reachStars = userDB.achievements.find((ach) => {
    return ach.name === "Reach for the Stars";
  });
  if (bankMoney >= "10000000000" && !reachStars) {
    userDB.achievements.push({ name: "Reach for the Stars", value: true });

    role = message.guild.roles.cache.find((r) => r.id === "799301358376976424");
    message.guild.members.cache.get(user.id).roles.add(role);

    message.channel.send({
      embed: {
        title: `**NOVO DOSTIGNUĆE!**`,
        description: `🥳 **ČESTITAMO TI!** 🥳\n\n🏆 | Imas više od ***10.000.000.000€*** na banci.\n🔓 | Otključao si "***Reach for the Stars***"`,
        color: 0x00ff00,
      },
    });
  }
};
module.exports.help = {
  name: "deposit",
  aliases: ["dep"],
};
