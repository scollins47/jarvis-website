const express = require("express");
const http = require('http');
const app = express();
app.use(express.static('public'));
app.use(express.json());
const server = http.createServer(app);

const io = require('socket.io')(server);
const msgQueue = [];
server.listen(8080, console.log("Listening on port 8080"));
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: './' });
});
app.get("/hub", (req, res) => {
    res.sendFile("apiHub.html", {root: './'});
})
app.post("/talking", (req, res) => {
    let words = req.body.text;
    console.log({ words });
    io.sockets.emit("talking")
});
app.post('/response', (req, res) => {
    console.log(req.body);
    io.sockets.emit("response", { message: req.body.message });
})
app.get('/getMessage', (req, res) => {
    if (msgQueue.length > 0) {
        let info = msgQueue.shift();
        let message = info.message;
        let apiSelected = info.apiSelected;
        res.json({message, apiSelected});
    } else {
        res.json({message: "", apiSelected: -1});
    }
});
io.sockets.on('connection', onConnect);
io.sockets.use((socket, next) => {
    next();
});

function onConnect(socket) {
    console.log(`${socket.id} connected`);
    socket.on("message", ({ message, apiSelected }) => {
        msgQueue.push({ message, apiSelected });
    });
}
