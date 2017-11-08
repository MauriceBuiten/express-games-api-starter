// models/game.js
const mongoose = require('../config/database')
const { Schema } = mongoose

// const cardSchema = new Schema({
//   symbol: { type: String, required: true },
//   visible: { type: Boolean, default: false },
//   won: { type: Boolean, default: false },
// }, { usePushEach: true });

const playerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
  points: { type: Number }
}, { usePushEach: true });
//
// const playerSchema = new Schema({
//   userId: { type: Schema.Types.ObjectId, ref: 'users' },
//   pairs: [String],
// }, { usePushEach: true });

 const gameSchema = new Schema({
  players: [playerSchema],
 letterBoard: { type: String, required: true },
  word: { type: String, required: true },
  guesses: { type: Array },
  completed: { type: Boolean },
  currentTurn: { type: Number, default: 0 },
  wheelValue: { type: Number, required: true },
  started: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  draw: { type: Boolean, default: false },
}, { usePushEach: true });

// const gameSchema = new Schema({
//   players: [playerSchema],
//   turn: { type: Number, default: 0 }, // player index
//   started: { type: Boolean, default: false },
//   winnerId: { type: Schema.Types.ObjectId, ref: 'users' },
//   userId: { type: Schema.Types.ObjectId, ref: 'users' },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
//   lastCard: { type: Number },
//   draw: { type: Boolean, default: false },
// }, { usePushEach: true });

module.exports = mongoose.model('games', gameSchema)
