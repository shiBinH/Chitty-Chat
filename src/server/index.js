let express = require('express')
let path = require('path');
let http = require('http');
let socketIO = require('socket.io');

let app = express();
let server = http.Server(app);
let io = socketIO(server);

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
