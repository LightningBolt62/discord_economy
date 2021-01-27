const Discord = require("discord.js");
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

  let author = message.author;
  let embed = (message, color) => {
    return new Discord.MessageEmbed()
      .setColor(color)
      .setThumbnail("https://i.ibb.co/LxdFtV6/Pla-anje.png")
      .setTimestamp(new Date())
      .setFooter(author.username, author.avatarURL())
      .setDescription(message);
  };

  const mentionFormat = Discord.MessageMentions.USERS_PATTERN;
  if (mentionFormat.test(args[0]) === false && !user) {
    return message.channel.send(
      embed(
        `\n**💸 __ᴛʀᴀɴꜱꜰᴇʀ ɴᴏᴠᴄᴀ__**\n\n✍️︱Označite osobu kojoj želite poslati novac!`,
        "#ffc83d"
      )
    );
  }

  if (!args[1]) {
    return message.channel.send(
      embed(
        `\n**💸 __ᴛʀᴀɴꜱꜰᴇʀ ɴᴏᴠᴄᴀ__**\n\n✍️︱Unesite iznos koji želite poslati!`,
        "#ffc83d"
      )
    );
  }

  if (user.id === author.id) {
    return message.channel.send(
      embed(
        `\n**💸 __ᴛʀᴀɴꜱꜰᴇʀ ɴᴏᴠᴄᴀ__**\n\n🖕︱Ne možete sami sebi dati novac!`,
        "#ffc83d"
      )
    );
  }

  let numberPattern = new RegExp("^[0-9]+$");
  if (!numberPattern.test(args[1])) {
    return message.channel.send(
      embed(
        `\n**💸 __ᴛʀᴀɴꜱꜰᴇʀ ɴᴏᴠᴄᴀ__**\n\n✍️︱Upišite vašu količinu bez simbola!`,
        "#ffc83d"
      )
    );
  }

  if (userDB.money < args[1]) {
    return message.channel.send(
      embed(
        `\n**💸 __ᴛʀᴀɴꜱꜰᴇʀ ɴᴏᴠᴄᴀ__**\n\n✋︱Nemate toliko novca!`,
        "#ff0000"
      )
    );
  }

  message.channel.send(
    embed(
      `\n**💸 __ᴛʀᴀɴꜱꜰᴇʀ ɴᴏᴠᴄᴀ__**\n\n👍︱Uspješno si korisniku ${user} poslao **${args[1]}€**`,
      "#80ff00"
    )
  );

  userDB.money -= Number(args[1]);
  userDB.save();

  userDB2.money += Number(args[1]);
  userDB2.save();
};

module.exports.help = {
  name: "pay",
  aliases: [""],
};
