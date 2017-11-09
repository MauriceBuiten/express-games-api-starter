// models/game.js
const mongoose = require('../config/database')
const { Schema } = mongoose

// function getWord() {
//   var words = ["refrigerator", "telephone", "pillowcase", "doormat", "houseplant", "gaming", "curtains"]
//   return words[Math.floor(Math.random() * words.length)];
// }
//
// function showLetterBoard(word) {
//   return word.split('').map(letter => '_').join(' ');
// }

const initialWord = getWord()

const playerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
  points: { type: Number }
}, { usePushEach: true });

const gameSchema = new Schema({
  players: [playerSchema],
  turn: { type: Number, default: 0 },
  // word: { type: String, default: initialWord },
  // letterBoard: { type: String, default: showLetterBoard(initialWord) },
  word: { type: String, default: '' },
  letterBoard: { type: String, default: '' },
  guesses: { type: Array },
  completed: { type: Boolean, default: false },
  wheelValue: { type: Number, default: 0 },
  started: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  draw: { type: Boolean, default: false },
}, { usePushEach: true });

module.exports = mongoose.model('games', gameSchema)
