const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  ID: {
    type: String,
    default: null,
  },
  guildID: {
    type: String,
    default: null,
  },
  rank: {
    type: String,
    default: null,
  },
  achievements: [
    {
      name: {
        type: String,
        default: null,
      },
      value: {
        type: String,
        default: null,
      },
    },
  ],
  money: {
    type: Number,
    default: 0,
  },
  bank: {
    type: Number,
    default: 0,
  },
  beg: {
    type: String,
    default: null,
  },
  work: {
    type: String,
    default: null,
  },
  rob: {
    type: String,
    default: null,
  },
  weekly: {
    type: String,
    default: null,
  },
  daily: {
    type: String,
    default: null,
  },
  playedRoulette: {
    type: Number,
    default: 0,
  },
  playedSlots: {
    type: Number,
    default: 0,
  },
  gamblingTimeout: {
    type: String,
    default: null,
  },
  test: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("user", userSchema);
