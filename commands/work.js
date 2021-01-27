const Discord = require("discord.js");
const ms = require("parse-ms");
const { serverThumb } = require("../botconfig.json");
const userModel = require("../models/User");

const jobs = [
  {
    title: "Grafički Dizajner",
    min: 50,
    max: 500,
    bonus: 1,
  },
  {
    title: "Web Dizajner",
    min: 50,
    max: 700,
    bonus: 1,
  },
  {
    title: "Programer",
    min: 100,
    max: 600,
    bonus: 1,
  },
  {
    title: "Građevinar",
    min: 50,
    max: 400,
    bonus: 1,
  },
  {
    title: "Doktor",
    min: 500,
    max: 900,
    bonus: 1,
  },
  {
    title: "Policajac",
    min: 100,
    max: 1000,
    bonus: 1,
  },
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
      .setThumbnail(serverThumb)
      .setTimestamp(new Date())
      .setFooter(user.username, user.avatarURL())
      .setDescription(message);
  };

  let author = userDB.work;
  let timeout = 600000;

  if (userDB.rank === "Bronze") {
    timeout = 500000;
  }
  if (userDB.rank === "Silver") {
    timeout = 400000;
  }
  if (userDB.rank === "Gold") {
    timeout = 300000;
  }
  if (userDB.rank === "Platinum") {
    timeout = 200000;
  }
  if (userDB.rank === "Diamond") {
    timeout = 100000;
  }
  if (userDB.rank === null) random = Math.floor(Math.random() * 100) + 1;

  if (author !== null && timeout - (Date.now() - author) > 0) {
    let time = ms(timeout - (Date.now() - author));

    message.channel.send(
      embed(
        `\n**🏛 __ᴅɪᴀᴍᴏɴᴅ ʙɪʀᴏ__**\n\n👎︱**Već si radio!**\n✋︱Pokušaj ponovo za **${time.minutes}** minut/a **${time.seconds}** sekund/i.`,
        "#ff0000"
      )
    );
  } else {
    let result = Math.floor(Math.random() * jobs.length);
    let amount =
      (Math.floor(Math.random() * (jobs[result].max - jobs[result].min + 1)) +
        jobs[result].min) *
      jobs[result].bonus;

    message.channel.send(
      embed(
        `\n**🏛 __ᴅɪᴀᴍᴏɴᴅ ʙɪʀᴏ__**\n\n👍︱Radio si kao ${jobs[result].title} i zaradio **${amount}€**.`,
        "#80ff00"
      )
    );

    userDB.money += Number(amount);
    userDB.work = Date.now();
    userDB.save();
  }
};

module.exports.help = {
  name: "work",
  aliases: ["wr"],
};
