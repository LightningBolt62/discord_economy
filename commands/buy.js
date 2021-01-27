const Discord = require("discord.js");
const { serverThumb } = require("../botconfig.json");
const { ranks, colors } = require("../configs/shop.config");
const userModel = require("../models/User");

ranks.concat(colors);

module.exports.run = async (bot, message, args) => {
  //if (!message.content.startsWith(botconfig.prefix)) return;

  let role = "";
  let user = message.author;
  const userDB = await userModel.findOne({
    ID: user.id,
    guildID: message.guild.id,
  });

  let embed = (message, color) => {
    return new Discord.MessageEmbed()
      .setColor(color)
      .setThumbnail("https://i.ibb.co/tBbxndC/Kupovina.png")
      .setTitle("**🛒 __ɪᴛᴇᴍ ꜱʜᴏᴘ__**")
      .setTimestamp(new Date())
      .setFooter(user.username, user.avatarURL())
      .setDescription(message);
  };

  const buyType = ["rank", "color"];
  if (!buyType.includes(args[0]))
    return message.channel.send(
      embed("👍︱Item koji ste unijeli ne postoji! [rank, color]", "#ff0000")
    );

  if (args[0] == "" || args[0] == undefined)
    return message.channel.send(
      embed("✍️︱Unesite tip itema! [rank, color]", "#ff0000")
    );

  if (args[1] == "" || args[1] == undefined)
    return message.channel.send(embed("✍️︱Unesite naziv itema!", "#ff0000"));

  switch (args[0]) {
    case "rank":
      let rank = ranks.find(
        (el) => el.name.toLowerCase() == args[1].toLowerCase()
      );

      if (rank === undefined)
        return message.channel.send(
          embed("👎︱Rank koji želite kupiti ne postoji!", "#ff0000")
        );

      let userRank = ranks
        .map((rank) => {
          return rank.name;
        })
        .indexOf(user.rank);

      if (userRank > ranks.indexOf(rank) || userRank == ranks.indexOf(rank))
        return message.channel.send(
          embed("👌︱Već imate veći rank!", "#ff0000")
        );

      if (user.money <= rank.price)
        return message.channel.send(
          embed("👎︱Nemate dovoljno novca!", "#ff0000")
        );

      userDB.rank = rank.name;
      userDB.money -= Number(rank.price);
      userDB.save();

      if (user.rank) {
        let role = message.guild.roles.cache.find(
          (r) => r.id === ranks[userRank].role_id
        );
        message.guild.members.cache.get(user.id).roles.remove(role);
      }

      role = message.guild.roles.cache.find((r) => r.id === rank.role_id);
      message.guild.members.cache.get(user.id).roles.add(role);

      return message.channel.send(
        embed(
          `👏︱Uspješno ste kupili rank **${rank.name}** za **${rank.price}**!`,
          "#80ff00"
        )
      );
      break;

    case "color":
      let color = colors.find(
        (el) => el.name.toLowerCase() == args[1].toLowerCase()
      );

      if (color === undefined)
        return message.channel.send(
          embed("👎︱Boja koju želite kupiti ne postoji!", "#ff0000")
        );

      if (user.money <= color.price)
        return message.channel.send(
          embed("👎︱Nemate dovoljno novca!", "#ff0000")
        );

      let userRole = message.member.roles.cache.find(
        (r) => r.id === color.role_id
      );

      if (userRole)
        return message.channel.send(embed("👌︱Već imate tu boju!", "#ff0000"));

      userDB.money -= Number(color.price);
      userDB.save();

      role = message.guild.roles.cache.find((r) => r.id === color.role_id);
      message.guild.members.cache.get(user.id).roles.add(role);

      return message.channel.send(
        embed(
          `👏︱Uspješno ste kupili boju **${color.name}** za **${color.price}**!`,
          "#80ff00"
        )
      );
      break;

    default:
      return message.channel.send(
        embed(
          "👎︱Tip itema koji ste unijeli ne postoji! [rank, color]",
          "#ff0000"
        )
      );
      break;
  }
};

module.exports.help = {
  name: "buy",
  aliases: [""],
};
