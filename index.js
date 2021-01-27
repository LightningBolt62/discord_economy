const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const fs = require("fs");
const bot = new Discord.Client({ disableEveryone: true });

// Models
const userModel = require("./models/User");

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) console.log(err);
  let jsfile = files.filter((f) => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
    props.help.aliases.forEach((alias) => {
      bot.aliases.set(alias, props.help.name);
    });
  });
});
bot.on("ready", async () => {
  mongoose
    .connect(botconfig.mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`MongoDB is ready`))
    .catch((err) => console.error(err));

  console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
  //bot.user.setStatus("online");
  bot.user.setActivity(`www.milkic.dev`, {
    type: "WATCHING",
    url: "https://www.milkic.dev/",
  });

  bot.on("message", async (message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    let commandfile;
    let wait = 0;

    let user = await userModel.findOne({ ID: message.author.id }).exec();
    if (!user) {
      wait = 2000;

      user = new userModel({
        ID: message.author.id,
        guildID: message.guild.id,
      });
      user.save();

      console.log(`MongoDB created new user with id: ${user.id}`);
    }

    let userMentions = message.mentions.members.first();
    if (userMentions) {
      let user2 = await userModel.findOne({ ID: userMentions.id });

      if (!user2) {
        wait = 2000;
        user2 = new userModel({
          ID: userMentions.id,
          guildID: message.guild.id,
        });
        user2.save();

        console.log(
          `MongoDB created new user from mentions with id: ${user.id}`
        );
      }
    }

    if (bot.commands.has(cmd)) {
      commandfile = bot.commands.get(cmd);
    } else if (bot.aliases.has(cmd)) {
      commandfile = bot.commands.get(bot.aliases.get(cmd));
    } else {
      return;
    }

    if (!message.content.startsWith(prefix)) return;

    try {
      setTimeout(() => {
        commandfile.run(bot, message, args);
      }, wait);
    } catch (e) {}
  });
});

bot.login("NzkzNTQ4MDUwOTg2NDM0NjAx.X-t3Ng.ZtqczSIkfP4-Xq5Hd52TdkA1y0w");
