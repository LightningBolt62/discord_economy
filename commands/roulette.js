const Discord = require("discord.js");
const ms = require("parse-ms");
const { serverThumb } = require("../botconfig.json");
const userModel = require("../models/User");

const black = [
  2,
  4,
  6,
  8,
  10,
  11,
  13,
  15,
  17,
  20,
  22,
  24,
  26,
  28,
  29,
  31,
  33,
  35,
];

const red = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

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
      .setTitle("🎰 __Kockarnica__")
      .setThumbnail("https://i.ibb.co/dmx5QXR/Rulet.png")
      .setTimestamp(new Date())
      .setFooter(user.username, user.avatarURL())
      .setDescription(message);
  };

  let timeout = 5000;
  let author = userDB.gamblingTimeout;
  if (author !== null && timeout - (Date.now() - author) > 0) {
    let time = ms(timeout - (Date.now() - author));

    return message.channel.send(
      embed(`✋︱Pokušaj ponovo za **${time.seconds}** sekund/i.`, "#ff0000")
    );
  }

  function isOdd(num) {
    if (black.includes(num)) return false;
    else if (red.includes(num)) return true;
  }

  let colour = args[0];
  let money = parseInt(args[1]);

  let random = Math.floor(Math.random() * 37);

  if (money > 10000)
    return message.channel.send(
      embed(`✋|Maksimalni ulog je 10.000€!`, "#ff0000")
    );

  let numberPattern = new RegExp("^[0-9]+$");
  if (!numberPattern.test(args[1])) {
    return message.channel.send(
      embed(
        `\n**💸 __ᴛʀᴀɴꜱꜰᴇʀ ɴᴏᴠᴄᴀ__**\n\n✍️︱Upišite vašu količinu bez simbola!`,
        "#ffc83d"
      )
    );
  }

  if (!colour)
    return message.channel.send(
      embed(`✍️︱Odredite boju | Red [1.5x] Black [2x] Green [15x]`, "#ffc83d")
    );
  colour = colour.toLowerCase();
  if (!money)
    return message.channel.send(
      embed(`✍️︱Unesite količinu za ulog!`, "#ffc83d")
    );

  if (money > userDB.money)
    return message.channel.send(embed(`✋︱Nemate toliko novca!`, "#ff0000"));

  if (colour == "b" || colour.includes("black")) colour = 0;
  else if (colour == "r" || colour.includes("red")) colour = 1;
  else if (colour == "g" || colour.includes("green")) colour = 2;
  else return message.channel.send(colorbad);

  let win = false;
  if (random == 0 && colour == 2) {
    // Green
    money *= 15;
    if (money >= "10000000") win = true;

    userDB.money += Number(money);

    message.channel.send(
      embed(`👏︱ Osvojio si **${money}€**\n\nDuplanje: 15x`, "#80ff00")
    );
  } else if (isOdd(random) && colour == 1) {
    // Red
    money = parseInt(money * 1.5);
    if (money >= "10000000") win = true;

    userDB.money += Number(money);

    message.channel.send(
      embed(`👏︱ Osvojio si **${money}€**\n\nDuplanje: 1.5x`, "#80ff00")
    );
  } else if (!isOdd(random) && colour == 0) {
    // Black
    money = parseInt(money * 2);
    if (money >= "10000000") win = true;

    userDB.money += Number(money);

    message.channel.send(
      embed(`👏︱ Osvojio si **${money}€**\n\nDuplanje: 2x`, "#80ff00")
    );
  } else {
    // Wrong
    userDB.money -= Number(money);

    message.channel.send(
      embed(`👎︱ Izgubio si **${money}€**\n\nDuplanje: 0x`, "#ff0000")
    );
  }

  let bigWin = userDB.achievements.find((ach) => {
    return ach.name === "Big Win";
  });
  if (!bigWin && win) {
    userDB.achievements.push({ name: "Big Win", value: true });

    role = message.guild.roles.cache.find((r) => r.id === "797956261269340170");
    message.guild.members.cache.get(user.id).roles.add(role);

    message.channel.send({
      embed: {
        title: `**NOVO DOSTIGNUĆE!**`,
        description: `🥳 **ČESTITAMO TI!** 🥳\n\n🏆 | Osvojio si vise od ***10.000.000€*** na ruletu.\n🔓 | Otključao si "***Big Win***"`,
        color: 0x00ff00,
      },
    });
  }

  userDB.playedRoulette = Number(0);
  userDB.playedRoulette += Number(500);
  if (userDB.playedRoulette === 500) {
    role = message.guild.roles.cache.find((r) => r.id === "799300344135417856");
    message.guild.members.cache.get(user.id).roles.add(role);

    message.channel.send({
      embed: {
        title: `**NOVO DOSTIGNUĆE!**`,
        description: `🥳 **ČESTITAMO TI!** 🥳\n\n🏆 | Ovo ti je ***500***. ruka na ruletu.\n🔓 | Otključao si "***Roulette Marathon***"`,
        color: 0x00ff00,
      },
    });
  }

  userDB.gamblingTimeout = Date.now();
  userDB.save();
};

module.exports.help = {
  name: "roulette",
  aliases: ["roul"],
};
