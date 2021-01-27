const Discord = require("discord.js");
const ms = require("parse-ms");
const { serverThumb } = require("../botconfig.json");
const userModel = require("../models/User");

const slotItems = [
  "🥝",
  "🍑",
  "🍒",
  "🍈",
  "🍓",
  "🍏",
  "🍇",
  "🍉",
  "🍌",
  "🍋",
  "🍊",
  "🍐",
  "🍎",
];

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
      .setTitle("**🎰 __ᴋᴏᴄᴋᴀʀɴɪᴄᴀ__**")
      .setThumbnail("https://i.ibb.co/gJjrvYf/Slotovi.png")
      .setTimestamp(new Date())
      .setFooter(user.username, user.avatarURL())
      .setDescription(message);
  };

  let author = userDB.gamblingTimeout;
  let money = parseInt(args[0]);
  let win = false;
  let timeout = 5000;

  let numberPattern = new RegExp("^[0-9]+$");
  if (!numberPattern.test(args[0])) {
    return message.channel.send(
      embed(
        `\n**💸 __ᴛʀᴀɴꜱꜰᴇʀ ɴᴏᴠᴄᴀ__**\n\n✍️︱Upišite vašu količinu bez simbola!`,
        "#ffc83d"
      )
    );
  }

  if (author !== null && timeout - (Date.now() - author) > 0) {
    let time = ms(timeout - (Date.now() - author));

    return message.channel.send(
      embed(`✋︱Pokušaj ponovo za **${time.seconds}** sekund/i.`, "#ffff00")
    );
  }

  if (!money)
    return message.channel.send(embed(`✍️︱Navedite iznos!`, "#ffff00"));
  if (money > userDB.money)
    return message.channel.send(embed(`👎︱Nemate toliko novca!`, "#FFFFFF"));

  let number = [];
  for (i = 0; i < 3; i++) {
    number[i] = Math.floor(Math.random() * slotItems.length);
  }

  if (number[0] == number[1] && number[1] == number[2]) {
    money *= 9;
    win = true;
  } else if (
    number[0] == number[1] ||
    number[0] == number[2] ||
    number[1] == number[2]
  ) {
    money *= 2;
    win = true;
  }
  if (win) {
    message.channel.send(
      embed(
        `${slotItems[number[0]]} | ${slotItems[number[1]]} | ${
          slotItems[number[2]]
        }\n\n👏Osvojili ste **${money}€**`,
        "#80ff00"
      )
    );

    userDB.money += Number(money);

    let goldenEmperor = userDB.achievements.find((ach) => {
      return ach.name === "Golden Emperor";
    });
    if (!goldenEmperor && money >= "250000") {
      userDB.achievements.push({ name: "Golden Emperor", value: true });

      role = message.guild.roles.cache.find(
        (r) => r.id === "799300336921346069"
      );
      message.guild.members.cache.get(user.id).roles.add(role);

      message.channel.send({
        embed: {
          title: `**NOVO DOSTIGNUĆE!**`,
          description: `🥳 **ČESTITAMO TI!** 🥳\n\n🏆 | Osvojio si vise od ***250.000€*** na slotovima.\n🔓 | Otključao si "***Golden Emperor***"`,
          color: 0x00ff00,
        },
      });
    }
  } else {
    message.channel.send(
      embed(
        `${slotItems[number[0]]} | ${slotItems[number[1]]} | ${
          slotItems[number[2]]
        }\n\n👎︱Izgubili ste **${money}€**`,
        "#ff0000"
      )
    );

    userDB.money -= Number(money);

    let ghostMachine = userDB.achievements.find((ach) => {
      return ach.name === "Ghost In The Machine";
    });
    if (!ghostMachine && money >= "1000000") {
      userDB.achievements.push({ name: "Ghost In The Machine", value: true });

      role = message.guild.roles.cache.find(
        (r) => r.id === "799300353962541056"
      );
      message.guild.members.cache.get(user.id).roles.add(role);

      message.channel.send({
        embed: {
          title: `**NOVO DOSTIGNUĆE!**`,
          description: `🥳 **ČESTITAMO TI!** 🥳\n\n🏆 | Izgubio si vise od ***1.000.000€*** na slotovima.\n🔓 | Otključao si "***Ghost in the Machine***"`,
          color: 0x00ff00,
        },
      });
    }
  }

  userDB.playedSlots += Number(1);
  if (userDB.playedSlots === 500) {
    role = message.guild.roles.cache.find((r) => r.id === "799300349852123167");
    message.guild.members.cache.get(user.id).roles.add(role);

    message.channel.send({
      embed: {
        title: `**NOVO DOSTIGNUĆE!**`,
        description: `🥳 **ČESTITAMO TI!** 🥳\n\n🏆 | Ovo ti je ***500***. ruka na slotovima.\n🔓 | Otključao si "***Déjà Vu***"`,
        color: 0x00ff00,
      },
    });
  }

  userDB.gamblingTimeout = Date.now();
  userDB.save();
};

module.exports.help = {
  name: "slots",
  aliases: ["sl"],
};
