// ==== Global Variables ====
let currentMove = "white";
let chessBoard;
let defaultPositions = [
  ['rook', 'knight', 'bishop', 'king', 'queen', 'bishop', 'knight', 'rook'],
  ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', ],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
  ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', ],
  ['rook', 'knight', 'bishop', 'king', 'queen', 'bishop', 'knight', 'rook']
];

function setup() {
  noStroke();
  createCanvas(windowWidth, windowHeight);
  chessBoard = new ChessBoard(defaultPositions);
  chessBoard.updateSquares();
}

function draw() {
  background(204);
  chessBoard.renderBoard();
}