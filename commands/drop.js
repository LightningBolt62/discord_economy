const Discord = require("discord.js");
const role = require("../rolechecker");
const userModel = require("../models/User");

module.exports.run = async (client, message, args) => {
  if (!message.member.permissions.has("ADMINISTRATOR"))
    return message.channel.send({
      embed: {
        title: `**Greška**`,
        description: "👎︱Nemaš potrebnu permisiju za korišćenje ove komande!",
        color: 0xe2ff00,
      },
    });

  let vrsta = args[0];
  if (!vrsta)
    return message.channel.send({
      embed: {
        title: `**Greška**`,
        description: "✍️︱Nisi napisao vrstu [ role/money ].",
        color: 0xe2ff00,
      },
    });
  if (vrsta === "role") {
    let uloga = message.mentions.roles.first();
    if (!uloga)
      return message.channel.send({
        embed: {
          title: `**Greška__**`,
          description: "✍️︱Nisi označio role.",
          color: 0xe2ff00,
        },
      });
    if (role.isModerator(uloga))
      return message.channel.send({
        embed: {
          title: `**Greška**`,
          description:
            "✋︱Uloga koju si pokušao dropovati ima moderatorske permisije.",
          color: 0x36393f,
        },
      });
    message.delete();
    let embed = new Discord.MessageEmbed()
      .setTitle("👤 Pojavio se neočekivani drop!")
      .setColor(uloga.color)
      .setThumbnail("https://i.ibb.co/bvv4WQc/Poklon.png")
      .setDescription(
        "U dropu se nalazi uloga **" +
          uloga.name +
          "**\nDa je uzmeš reaguj na ovu poruku sa 👤\nNakon 30 sekundi ovaj drop će nestati."
      )
      .setTimestamp();
    let msg = await message.channel.send(embed);
    await msg.react("👤");
    const filter = (reaction, user) =>
      reaction.emoji.name === "👤" && user.id !== client.user.id;
    const collector = msg.createReactionCollector(filter, { time: 30000 });
    let timelimit = true;
    let collected = false;
    collector.on("collect", (reaction, reactionCollector) => {
      reaction.users.cache.forEach((user) => {
        if (user.id !== client.user.id) {
          let member = message.guild.members.cache.get(user.id);
          if (member.roles.cache.has(uloga.id)) return;

          if (!collected) {
            collected = true;
            msg.reactions.removeAll();
            let takenEmbed = new Discord.MessageEmbed()
              .setAuthor(
                "IZNENADNI DROP",
                "https://i.ibb.co/bvv4WQc/Poklon.png"
              )
              .setColor("RANDOM")
              .setTitle(
                user.username + " je uzeo/la ulogu iz dropa, 🎉 čestitam. "
              );
            member.roles
              .add(uloga)
              .then(() => {
                msg.edit(takenEmbed);
                timelimit = false;
              })
              .catch(() => {});
          }
        }
      });
    });
    collector.on("end", (collected) => {
      if (timelimit) {
        let expiredEmbed = new Discord.MessageEmbed().setTitle(
          "👎︱Isteklo je vreme za reakciju."
        );
        msg.edit(expiredEmbed);
      }
    });
  } else if (vrsta === "money") {
    let novac = args[1];
    if (!novac)
      return message.channel.send({
        embed: {
          title: `**Greška**`,
          description: "✍️︱Nisi napisao iznos novca.",
          color: 0xe2ff00,
        },
      });
    if (isNaN(novac) || novac < 1 || novac > 500000)
      return message.channel.send({
        embed: {
          title: `**Greška**`,
          description:
            "✋︱Novac ne može sadržavati znakove, biti manji od 1€ ili veći od 500000€.",
          color: 0xe2ff00,
        },
      });
    message.delete();
    let embed = new Discord.MessageEmbed()
      .setTitle("💸 Pojavio se neočekivani drop!")
      .setColor("RANDOM")
      .setThumbnail("https://i.ibb.co/bvv4WQc/Poklon.png")
      .setDescription(
        "U dropu se nalazi **" +
          novac +
          "€**\nDa uzmeš novac iz dropa reaguj na ovu poruku sa 💸\nNakon 30 sekundi ovaj drop će nestati."
      )
      .setTimestamp();
    let msg = await message.channel.send(embed);
    await msg.react("💸");
    const filter = (reaction, user) =>
      reaction.emoji.name === "💸" && user.id !== client.user.id;
    const collector = msg.createReactionCollector(filter, { time: 30000 });
    let timelimit = true;
    let collected = false;
    collector.on("collect", (reaction, reactionCollector) => {
      reaction.users.cache.forEach(async (user) => {
        if (user.id !== client.user.id) {
          if (!collected) {
            collected = true;
            msg.reactions.removeAll();
            let takenEmbed = new Discord.MessageEmbed()
              .setAuthor(
                "IZNENADNI DROP",
                "https://i.ibb.co/bvv4WQc/Poklon.png"
              )
              .setColor("RANDOM")
              .setTitle(
                user.username +
                  " je uzeo " +
                  novac +
                  "€ iz dropa, 🥳 čestitam. "
              );

            const userDB = await userModel.findOne({
              ID: user.id,
              guildID: message.guild.id,
            });
            userDB.money += Number(novac);
            userDB.save();

            msg.edit(takenEmbed);
            timelimit = false;
          }
        }
      });
    });
    collector.on("end", (collected) => {
      if (timelimit) {
        let expiredEmbed = new Discord.MessageEmbed().setTitle(
          "👎︱Isteklo je potrebno vreme za reakciju."
        );
        msg.edit(expiredEmbed);
      }
    });
  } else
    return message.channel.send({
      embed: {
        title: `**Greška**`,
        description: "✍️︱Napisao si nepravilnu vrstu dropa.",
        color: 0xe2ff00,
      },
    });
};
module.exports.help = {
  name: "drop",
  description: "dropanje uloga ili novca",
  usage: "drop [vrsta (role/money)]",
  category: "admin",
  aliases: [],
  listed: true,
};
