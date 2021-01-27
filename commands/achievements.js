const Discord = require("discord.js");
const { serverThumb } = require("../botconfig.json");
const userModel = require("../models/User");

exports.run = async (bot, message, args) => {
  let user = message.mentions.members.first() || message.author;
  const userDB = await userModel.findOne({
    ID: user.id,
    guildID: message.guild.id,
  });

  let author = message.author;
  let embed = (message, color) => {
    return new Discord.MessageEmbed()
      .setColor(color)
      .setTitle("📊 Dostignuća")
      .setThumbnail("https://i.ibb.co/Bg64Sr5/Statistika.png")
      .setTimestamp(new Date())
      .setFooter(author.username, author.avatarURL())
      .setDescription(message);
  };

  let fields = "";
  let bigWin = userDB.achievements.find((ach) => {
    return ach.name === "Big Win";
  });
  if (bigWin) fields += ":money_mouth:・ʙɪɢ ᴡɪɴ\n";

  let rouletteMarathon = userDB.achievements.find((ach) => {
    return ach.name === "Roulette Marahton";
  });
  if (rouletteMarathon) fields += ":star_struck:・ʀᴏᴜʟᴇᴛᴛᴇ ᴍᴀʀᴀᴛʜᴏɴ\n";

  let goldenEmperor = userDB.achievements.find((ach) => {
    return ach.name === "Golden Emperor";
  });
  if (goldenEmperor) fields += ":partying_face:・ɢᴏʟᴅᴇɴ ᴇᴍᴘᴇʀᴏʀ\n";

  let ghostMachine = userDB.achievements.find((ach) => {
    return ach.name === "Ghost In The Machine";
  });
  if (ghostMachine) fields += ":ghost:・ɢʜᴏꜱᴛ ɪɴ ᴛʜᴇ ᴍᴀᴄʜɪɴᴇ\n";

  let dejaVu = userDB.achievements.find((ach) => {
    return ach.name === "Deja Vu";
  });
  if (dejaVu) fields += ":smiling_imp:・ᴅᴇᴊᴀ ᴠᴜ\n";

  let reachMoon = userDB.achievements.find((ach) => {
    return ach.name === "Reach for the Moon";
  });
  if (reachMoon) fields += ":astonished:・ʀᴇᴀᴄʜ ꜰᴏʀ ᴛʜᴇ ᴍᴏᴏɴ\n";

  let reachSky = userDB.achievements.find((ach) => {
    return ach.name === "Reach for the Sky";
  });
  if (reachSky) fields += ":open_mouth:・ʀᴇᴀᴄʜ ꜰᴏʀ ᴛʜᴇ ꜱᴋʏ\n";

  let reachStars = userDB.achievements.find((ach) => {
    return ach.name === "Reach for the Stars";
  });
  if (reachStars) fields += ":hushed:・ʀᴇᴀᴄʜ ꜰᴏʀ ᴛʜᴇ ꜱᴛᴀʀꜱ\n";

  let playedRoulette = userDB.playedRoulette;
  if (playedRoulette <= 500)
    fields += `:star_struck:・ʀᴏᴜʟᴇᴛᴛᴇ ᴍᴀʀᴀᴛʜᴏɴ (${playedRoulette})\n`;

  let playedSlots = userDB.playedSlots;
  if (playedSlots <= 500) fields += `:smiling_imp:・ᴅᴇᴊᴀ ᴠᴜ (${playedSlots})\n`;

  message.channel.send(embed(`**Korisnika: ${user}**\n\n${fields}`, "#ffff00"));
};

module.exports.help = {
  name: "achievements",
  aliases: ["ach"],
};
