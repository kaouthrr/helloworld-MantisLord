
exports.validateGameInput = (req, res, next) => {
    const { player1, player2 } = req.body;
    if (!player1 || !player2) {
        return res.status(400).json({ message: 'Player names are required' });
    }
    next();
};
