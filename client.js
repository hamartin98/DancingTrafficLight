const webSocket = new WebSocket("ws://localhost:8080/");
const size = 64;

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const canvasSize = window.innerHeight;
canvas.height = canvasSize;
canvas.width = canvasSize;

const pixelSize = (canvas.height / size).toFixed();

webSocket.onopen = function () {
  webSocket.send("Now we can communicate.");
};

webSocket.onmessage = function (event) {
  var frame = event.data;
  var idx = 0; // running index on frame data

  context.clearRect(0, 0, canvas.width, canvas.height); // clear screen

  for (let col = 0; col < size; col++) {
    for (let row = 0; row < size; row++) {
      context.beginPath();
      context.rect(pixelSize * row, pixelSize * col, pixelSize, pixelSize);
      var pixel = frame[idx++];

      switch (pixel) {
        case "1":
          context.fillStyle = "#060"; // dark green
          break;
        case "2":
          context.fillStyle = "#3c3"; // light green
          break;
        default:
          context.fillStyle = "#121212"; // black
      }

      context.fill();
    }
  }
};
