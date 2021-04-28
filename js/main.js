// ==== Global Variables ====
let currentMove = "white";
let chessBoard;
let demo = [ // 9x9
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'star', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
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
let pieceImages;

let config = {
  pieceSetup: standardSetup,
  showPossibleMoves: true,
  highlightPotentialKills: true,
  showCoordinates: false,
  enforceTurns: true,
  showAllSquaresInCheck: false,
  renderPieces: true,
  friendlyFire: false,
  doStroke: true,
  debug: false,
};

function preload() {
  pieceImages = {
    white: {
      pawn: loadImage('imgs/white_pawn.png'),
      rook: loadImage('imgs/white_rook.png'),
      knight: loadImage('imgs/white_knight.png'),
      bishop: loadImage('imgs/white_bishop.png'),
      queen: loadImage('imgs/white_queen.png'),
      king: loadImage('imgs/white_king.png'),
      star: loadImage('imgs/white_star.png'),
    },
    black: {
      pawn: loadImage('imgs/black_pawn.png'),
      rook: loadImage('imgs/black_rook.png'),
      knight: loadImage('imgs/black_knight.png'),
      bishop: loadImage('imgs/black_bishop.png'),
      queen: loadImage('imgs/black_queen.png'),
      king: loadImage('imgs/black_king.png'),
      star: loadImage('imgs/black_star.png'),
    },
  };
}

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