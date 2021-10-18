const fs = require("fs");
const WebSocket = require("ws");
const parser = require("csv-parse");

const PORT = 8080;
const socketServer = new WebSocket.Server({ port: PORT });
const interval = 1000 / 60; // interval of frame refresh

var frames = []; // store frames
var clients = []; // store connected clients

fs.createReadStream("./dtl.csv")
  .pipe(parser({ delimiter: ";" }))
  .on("data", function (dataRow) {
    frames.push(JSON.stringify(dataRow.reverse().join("").split('"')));
  });

var idx = 0; // index of the current frame

setInterval(() => {
  if(clients.length != 0){
    var currFrame = frames[idx]; // get the current frame
    clients.forEach((element) => element.send(currFrame)); // send the current frame the every connected client
    idx = idx < frames.length ? idx + 1 : 0;
  }
}, interval);

socketServer.on("connection", function (socket) {
  console.log("A new client connected.");
  clients.push(socket);

  socket.on("message", function (msg) {
    console.log("Client's message: " + msg);
  });

  socket.on("close", function () {
    console.log("Client disconnected.");
  });
});

console.log("Server is listening on port " + PORT);