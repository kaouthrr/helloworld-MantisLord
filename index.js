const express = require('express');
const http = require('http');
const { connect, connection } = require('mongoose');
const morgan = require('morgan');
const { json } = require('body-parser');
const path = require('path');
require('dotenv').config();

const characterRoutes = require('./routes/characters');
const app = express();
app.use(express.json());
app.use('/api/characters', characterRoutes);

const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const port = process.env.PORT || 3000;

app.use(morgan('dev'));

app.use('/api/characters', characterRoutes);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  console.log(error);
  res.json({
    message: error.message,
  });
});

// Connect to our database (Mongodb)
connect(process.env.MONGODB_URI);

connection.once('open', () => {
  console.log('Connected to the database MongoDB');
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});

connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let playingArray = [];

io.on("connection", (socket) => {
  console.log('a user connected');

  socket.on("find", (e) => {
    if (e.name) {
      arr.push(e.name);
      if (arr.length >= 2) {
        let p1obj = { p1name: arr[0], p1value: "X", p1move: "" };
        let p2obj = { p2name: arr[1], p2value: "O", p2move: "" };
        let obj = { p1: p1obj, p2: p2obj, sum: 1 };
        playingArray.push(obj);
        arr.splice(0, 2);
        io.emit("find", { allPlayers: playingArray });
      }
    }
  });

  socket.on("playing", (e) => {
    if (e.value === "X") {
      let objToChange = playingArray.find(obj => obj.p1.p1name === e.name);
      objToChange.p1.p1move = e.id;
      objToChange.sum++;
    } else if (e.value === "O") {
      let objToChange = playingArray.find(obj => obj.p2.p2name === e.name);
      objToChange.p2.p2move = e.id;
      objToChange.sum++;
    }
    io.emit("playing", { allPlayers: playingArray });
  });

  socket.on("gameOver", (e) => {
    playingArray = playingArray.filter(obj => obj.p1.p1name !== e.name && obj.p2.p2name !== e.name);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
