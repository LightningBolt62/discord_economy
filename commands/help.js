const Discord = require("discord.js");
const db = require("quick.db");
const { prefix, serverThumb } = require("../botconfig.json");

module.exports.run = async (bot, message, args) => {
  //if (!message.content.startsWith(botconfig.prefix)) return;

  let user = message.author;
  let embed = (message, color) => {
    return new Discord.MessageEmbed()
      .setColor(color)
      .setThumbnail("https://i.ibb.co/sRRgkNp/Pomo.png")
      .setTitle(`Diamond Ekonomija 💎 [${prefix}]`)
      .setFooter("ᴍᴀᴅᴇ ᴡɪᴛʜ 💗 ʙʏ ᴍɪʟᴋɪᴄ.ᴅᴇᴠ & ꜱᴠᴇᴍɪʀᴋᴏ")
      .setDescription(message);
  };

  message.channel.send(
    embed(``, "#FFFFFF")
      .addField(
        "Komande za ekonomiju",
        "`work` `beg` `rob` `pay` `profile` `withdraw` `deposit` `daily` `weekly` `store` `buy` `achievements`"
      )
      .addField("Komande za kockanje", "`roulette` `slots`")
  );
};

module.exports.help = {
  name: "help",
  aliases: [""],
};
