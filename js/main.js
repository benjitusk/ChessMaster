// ==== Global Variables ====
let currentMove = "white";
let chessBoard;
let demo = [ // 11x11
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'king', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'bishop', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none']
];

let standardSetup = [
  ['rook', 'knight', 'bishop', 'king', 'queen', 'bishop', 'knight', 'rook'],
  ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
  ['rook', 'knight', 'bishop', 'king', 'queen', 'bishop', 'knight', 'rook']
];

function setup() {
  noStroke();
  textAlign(CENTER, CENTER);
  createCanvas(windowWidth, windowHeight);
  chessBoard = new ChessBoard(standardSetup);
  chessBoard.updateSquares();
}

function draw() {
  background(204);
  chessBoard.renderBoard();
  if (chessBoard.winner) {
    chessBoard.renderBoard();
    noLoop();
    setTimeout(() => {
      alert(chessBoard.winner + ' wins! Click OK to look at the board for a bit longer, or refresh the page to start again.');
    }, 3);
  }
}

function mousePressed() {
  if (chessBoard.isMouseOn()) chessBoard.mouseClicked();
}