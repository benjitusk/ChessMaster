// ==== Global Variables ====
let currentMove = "white";
let chessBoard;

function setup() {
  createCanvas(windowWidth, windowHeight);
  chessBoard = new ChessBoard();
}

function draw() {
  background(204);
  chessBoard.renderBoard();
}