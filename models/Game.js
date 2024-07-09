
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    player1: {
        type: String,
        required: true
    },
    player2: {
        type: String,
        required: true
    },
    winner: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default: 'ongoing'
    }
});

module.exports = mongoose.model('Game', gameSchema);