const Game = require('../models/game');

exports.getAllGames = async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createGame = async (req, res) => {
    console.log("req body is :",req.body);
    const { player1, player2 } = req.body;

    try {
        const newGame = new Game({ player1, player2 });
        await newGame.save();
        res.status(201).json(newGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json(game);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateGame = async (req, res) => {
    const { winner, status } = req.body;
    try {
        const updatedGame = await Game.findByIdAndUpdate(req.params.id, { winner, status }, { new: true });
        if (!updatedGame) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json(updatedGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteGame = async (req, res) => {
    try {
        await Game.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted game' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};