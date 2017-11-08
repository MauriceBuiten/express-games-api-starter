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
  letterBoard: { type: String },
  word: { type: String },
  guesses: { type: Array },
  completed: { type: Boolean },
  wheelValue: { type: Number },
  started: { type: Boolean, default: false },
  winnerId: { type: Schema.Types.ObjectId, ref: 'users' },
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  draw: { type: Boolean, default: false },
}, { usePushEach: true });

module.exports = mongoose.model('games', gameSchema)
