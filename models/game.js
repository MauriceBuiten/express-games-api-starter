// models/game.js
const mongoose = require('../config/database')
const { Schema } = mongoose

const playerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
   points: { type: Number }
}, { usePushEach: true });

const gameSchema = new Schema({
  players: [playerSchema],
  turn: { type: Number, default: 0 },
  player_one_points:{ type: Number, default: 0 },
  player_two_points:{ type: Number, default: 0 },
  word: { type: String, default: '' },
  letterBoard: { type: String, default: '' },
  guesses: { type: Array },
  completed: { type: Boolean, default: false },
  wheelValue: { type: Number, default: 10 },
  started: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  draw: { type: Boolean, default: false },
}, { usePushEach: true });

module.exports = mongoose.model('games', gameSchema)
