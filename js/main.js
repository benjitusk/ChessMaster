// ==== Global Variables ====
let currentMove = "white";
let chessBoard;
let demo = [ // 9x9
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'rook', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'pawn', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'king', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
];

let standardSetup = [
  ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
  ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
  ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
];

let config = {
  pieceSetup: demo,
  showPossibleMoves: true,
  highlightPotentialKills: true,
  showCoordinates: true,
  enforceTurns: true,
  showAllSquaresInCheck: true,
  renderPieces: true,
  friendlyFire: true,
  doStroke: true,
  debug: true,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  chessBoard = new ChessBoard(config.pieceSetup);
  textSize(chessBoard.size / 6.3);
  textAlign(CENTER, CENTER);
  chessBoard.updateSquares();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(204);
  if (config.doStroke) {
    stroke(0);
    strokeWeight(0.5);
  } else {
    noStroke();
  }
  chessBoard.renderBoard();
  if (chessBoard.winner) {
    chessBoard.renderBoard();
    noLoop();
    setTimeout(() => {
      alert(chessBoard.winner + ' wins! Click Close to look at the board for a bit longer, or refresh the page to start again.');
    }, 3);
  }
}

function mousePressed() {
  if (chessBoard.isMouseOn()) chessBoard.mouseClicked();
}