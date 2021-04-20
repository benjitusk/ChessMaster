class ChessBoard {
  constructor(defaultPieces) {
    this.width = 8;
    this.height = 8;
    this.size = 90;
    this.pieces = [];
    this.squares = [];
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        let pos = createVector(i, j);
        this.squares.push(new Square(pos, this.size));
      }
    }
    for (var i = 0; i < defaultPieces.length; i++) {
      for (var j = 0; j < defaultPieces[i].length; j++) {
        let team;
        if (i < 4) { // If the pieces are generated on the top portion of the board
          team = 'black';
        } else {
          team = 'white';
        }
        let pos = createVector(j, i);
        if (defaultPieces[i][j] != 'none') {
          this.pieces.push(new Piece(defaultPieces[i][j], team, pos, this.size));
        }
      }
    }
  }

  renderBoard() {
    for (let square of this.squares) {
      square.render();
    }
    this.renderPieces();
  }

  updateSquares() {
    for (let square of this.squares) {
      square.highlight = false;
      let pos = createVector(square.x, square.y);
      for (let piece of this.pieces) {
        if (piece.pos.equals(pos)) {
          square.piece = piece;
          square.piece.square = square;
          break;
        }
      }
    }
  }

  renderPieces() {
    for (let piece of this.pieces) {
      piece.render();
    }
  }

  getPieceUnderMouse() {
    for (let square of this.squares) {
      if (square.mouseOver) {
        return square.piece;
      }
    }
    return null;
  }
}