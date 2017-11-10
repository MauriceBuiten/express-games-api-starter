// routes/games.js
const router = require('express').Router()
const passport = require('../config/auth')
const { Game } = require('../models')
const utils = require('../lib/utils')

const authenticate = passport.authorize('jwt', { session: false })

function getWord() {
  const words = ["refrigerator", "telephone", "pillowcase", "doormat", "houseplant", "gaming", "curtains", "pandemonium", "requiem", "rhytmstick", "coffeecup", "teabag"]
  return words[Math.floor(Math.random() * words.length)];
}

function showLetterBoard(word, guesses) {
  const splitWord = word.split('');

  const result = splitWord.map(letter => {
    if (guesses.indexOf(letter) === -1) {
      return '_';
    } else return letter;
  });

  const joined = result.join(' ');
  return joined;
}

function changeTurn(word, letter){
  const splitWord = word.split('')
  if(splitWord.indexOf(letter) === -1) {
    return true
  }
  else return false
}

module.exports = io => {
  router
    .get('/games', (req, res, next) => {
      Game.find()
        // Newest games first
        .sort({ createdAt: -1 })
        // Send the data in JSON format
        .then((games) => res.json(games))
        // Throw a 500 error if something goes wrong
        .catch((error) => next(error))
    })
    .get('/games/:id', (req, res, next) => {
      const id = req.params.id

      Game.findById(id)
        .then((game) => {
          if (!game) { return next() }
          res.json(game)
        })
        .catch((error) => next(error))
    })
    .post('/games', authenticate, (req, res, next) => {
      let initialWord = getWord()
      const newGame = {
        userId: req.account._id,
        players: [{
          userId: req.account._id,
          points: 0,
        }],
        word: initialWord,
        letterBoard: showLetterBoard(initialWord, [])
      }

      Game.create(newGame)
        .then((game) => {
          io.emit('action', {
            type: 'GAME_CREATED',
            payload: game
          })
          res.json(game)
        })
        .catch((error) => next(error))
    })
    .put('/games/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const updatedGame = req.body

      Game.findByIdAndUpdate(id, { $set: updatedGame }, { new: true })
        .then((game) => {
          io.emit('action', {
            type: 'GAME_UPDATED',
            payload: game
          })
          res.json(game)
        })
        .catch((error) => next(error))
    })
    .patch('/games/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const patchForGame = req.body
      const letter = req.body.key


      Game.findById(id)
        .then((game) => {
          if (!game) { return next() }
          const newGuesses = [...game.guesses, letter]
          const curPlayer = game.players[game.turn]
          let currentPoints = curPlayer.points

          if (changeTurn(game.word, letter) === true) {
            if (game.turn === 0) game.turn = 1
            else game.turn = 0
          }
          else {
            currentPoints += game.wheelValue
          }

          const updatedGame = {
            ...game,
             guesses: newGuesses,
             letterBoard: showLetterBoard(game.word, newGuesses),
             turn: game.turn,
              ...patchForGame
           }
           updatedGame.players[game.turn].points = currentPoints

          Game.findByIdAndUpdate(id, { $set: updatedGame }, { new: true })
            .then((game) => {
              io.emit('action', {
                type: 'GAME_UPDATED',
                payload: game
              })
              res.json(game)
            })
            .catch((error) => next(error))
        })
        .catch((error) => next(error))
    })
    .delete('/games/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      Game.findByIdAndRemove(id)
        .then(() => {
          io.emit('action', {
            type: 'GAME_REMOVED',
            payload: id
          })
          res.status = 200
          res.json({
            message: 'Removed',
            _id: id
          })
        })
        .catch((error) => next(error))
    })

  return router
}
