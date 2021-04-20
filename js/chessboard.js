class ChessBoard {
  constructor() {
    this.width = 8;
    this.height = 8;
    this.size = 90;
    this.pieces = []
  }

  renderBoard() {
    for (var i = 0; i < this.width; i++) {
      for (var j = 0; j < this.height; j++) {
        // if i and j are BOTH odd, or BOTH even, make the square light.
        if (( /*Both even*/ i % 2 == 0 && j % 2 == 0) || ( /*Both odd*/ i % 2 == 1 && j % 2 == 1)) {
          fill(255);
        } else {
          fill(0);
        }
        rect(i * this.size, j * this.size, this.size);
      }
    }
  }

  updatePieces(pieces) {
    this.pieces = pieces;
  }

  renderPieces() {
    for (let piece in this.pieces) {
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