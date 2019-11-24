const express = require('express'),
  path = require('path'),
  http = require('http'),
  socketIO = require('socket.io'),
  bodyParser = require('body-parser'),
  cors = require('cors');

const toneRoute = require('./routes/tone.route');

const app = express();
const server = http.Server(app);
const io = socketIO(server);
app.use(bodyParser.json());
app.use(cors());
app.use('/api', toneRoute);
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, '../../dist/chitty-chat/')))

app.get('*', (req, res) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, '../../dist/chitty-chat/index.html'));
})

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('new-message', (message) => {
        console.log(message);
        io.emit('new-message', message);
      });
});

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});
