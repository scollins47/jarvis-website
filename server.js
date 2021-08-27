const express = require("express");
const http = require('http');
const app = express();
app.use(express.static('public'));
app.use(express.json());
const server = http.createServer(app);

const io = require('socket.io')(server);
server.listen(8080, console.log("Listening on port 8080"));
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: './' });
});
app.get("/test", (req, res) => {
    res.sendFile("codepenTest.html", { root: './' });
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
app.post('/listening', (req, res) => {
    console.log(req);
    io.sockets.emit("listening", {seconds:req.body.seconds});
})
io.sockets.on('connection', onConnect);
io.sockets.use((socket, next) => {
    next();
});

function onConnect(socket) {
    console.log(`${socket.id} connected`);
}
