
const express = require('express');
const router = express.Router();
const {
    getAllGames,
    createGame,
    getGameById,
    updateGame,
    deleteGame
} = require('../controllers/GameController');

router.get('/', getAllGames);
router.post('/create', createGame);
router.get('/:id', getGameById);
router.put('/:id', updateGame);
router.delete('/:id', deleteGame);

module.exports = router;