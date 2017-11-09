// routes/games.js
const router = require('express').Router()
const passport = require('../config/auth')
const { Game } = require('../models')
const utils = require('../lib/utils')

const authenticate = passport.authorize('jwt', { session: false })

function getWord() {
  var words = ["refrigerator", "telephone", "pillowcase", "doormat", "houseplant", "gaming", "curtains"]
  return words[Math.floor(Math.random() * words.length)];
}

function showLetterBoard(word) {
  return word.split('').map(letter => '_').join(' ');
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
        letterBoard: showLetterBoard(initialWord)
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
      const letter = req.body.letter

      Game.findById(id)
        .then((game) => {
          if (!game) { return next() }
           var newGuesses = [...game.guesses, letter]

           console.log("newGuesses: " + newGuesses) 
           console.log("patch: " + patchForGame)

          const updatedGame = { ...game,guesses:newGuesses, ...patchForGame }
            // const updatedGame = { ...game, ...patchForGame }

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

//
//     .patch('/games/:id', authenticate, (req, res, next) => {
//   const id = req.params.id
//   const patchForGame = req.body
//   const index = req.body.index
//   const type = req.body.type
//
//   Game.findById(id)
//     .then((game) => {
//       if (!game) { return next() }
//       var horizontal = [...game.horizontal]
//       var vertical = [...game.vertical]
//       var board = [...game.board]
//
//       console.log("index: " + index)
//       console.log("type: " + type)
//       console.log("patch: " + patchForGame)
//       console.log("first " + horizontal)
//
//       if(type === "horizontal"){
//         horizontal[index] = 1
//         console.log(horizontal)
//       }
//
//       if(type === "vertical"){
//         vertical[index] = 1
//       }
//
//       const updatedGame = { ...game, horizontal: horizontal, vertical: vertical }
//       console.log(updatedGame)
//
//       Game.findByIdAndUpdate(id, { $set: updatedGame }, { new: true })
//         .then((game) => {
//           io.emit('action', {
//             type: 'GAME_UPDATED',
//             payload: game
//           })
//           res.json(game)
//         })
//         .catch((error) => next(error))
//     })
//     .catch((error) => next(error))
// })
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
