const Discord = require("discord.js");
const ms = require("parse-ms");
const { serverThumb } = require("../botconfig.json");
const userModel = require("../models/User");

module.exports.run = async (bot, message, args) => {
  //if (!message.content.startsWith(botconfig.prefix)) return;
  let user = message.mentions.members.first();
  const userDB = await userModel.findOne({
    ID: message.author.id,
    guildID: message.guild.id,
  });
  const userDB2 = await userModel.findOne({
    ID: user.id,
    guildID: message.guild.id,
  });

  if (!user) return;

  let authorS = message.author;
  let embed = (message, color) => {
    return new Discord.MessageEmbed()
      .setColor(color)
      .setTitle("🏃 __ᴋʀᴀᴅᴊᴀ ɴᴏᴠᴄᴀ__")
      .setThumbnail("https://i.ibb.co/NKsHfdB/Plja-ka.png")
      .setTimestamp(new Date())
      .setFooter(authorS.username, authorS.avatarURL())
      .setDescription(message);
  };

  if (user.id === authorS.id) {
    return message.channel.send(
      embed(`🖕︱Ne možete sami sebe opljačkali!`, "#ffc83d")
    );
  }

  let timeout = 600000; //600000

  if (userDB.rank === "Bronze") {
    random = Math.floor(Math.random() * 200) + 1;
    timeout = 500000;
  }
  if (userDB.rank === "Silver") {
    random = Math.floor(Math.random() * 250) + 1;
    timeout = 400000;
  }
  if (userDB.rank === "Gold") {
    random = Math.floor(Math.random() * 300) + 1;
    timeout = 300000;
  }
  if (userDB.rank === "Platinum") {
    random = Math.floor(Math.random() * 350) + 1;
    timeout = 200000;
  }
  if (userDB.rank === "Diamond") {
    random = Math.floor(Math.random() * 400) + 1;
    timeout = 100000;
  }
  if (userDB.rank === null) random = Math.floor(Math.random() * 100) + 1;

  if (timeout - (Date.now() - userDB.rob) > 0) {
    //author !== null &&
    let time = ms(timeout - (Date.now() - userDB.rob));

    message.channel.send(
      embed(
        `✋︱Već si opljačkao nekoga.\n\n ⏰ Pokušaj ponovo za ${time.minutes}minut/a ${time.seconds}sekund/i. `,
        "#ff0000"
      )
    );
  } else {
    if (userDB2.money < 0) {
      return message.channel.send(
        embed(
          `👎︱${user.username} nema ništa što biste mogli opljačkati.`,
          "#ff0000"
        )
      );
    }

    if (userDB2.money < 200) {
      return message.channel.send(
        embed(
          `🤏︱Osoba mora imati najmanje 200€ u novčaniku da biste je opljačkali.`,
          "#ff0000"
        )
      );
    }

    message.channel.send(
      embed(`👍︱Opljačkali ste ${user} i pobjegli sa ${random}€`, "#80ff00")
    );

    userDB.money += Number(random);
    userDB.rob = Date.now();
    userDB.save();

    userDB2.money -= Number(random);
    userDB2.save();
  }
};

module.exports.help = {
  name: "rob",
  aliases: [""],
};
