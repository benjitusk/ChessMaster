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

  isMouseOn() {
    return (mouseX > 0 && mouseX < this.width * this.size &&
      mouseY > 0 && mouseY < this.height * this.size);
  }

  switchCurrentMove() {
    currentMove = (currentMove == 'white') ? 'black' : 'white';
  }

  renderBoard() {
    for (let square of this.squares) {
      square.render();
    }
    this.renderPieces();
  }

  updateSquares() {
    for (let square of this.squares) {
      // Turn off the highlighting of all squares
      square.highlight = false;
      // un-assign pieces from squares
      // this is needed because
      // although there is a square for every piece,
      // there is NOT a piece for every square.
      // We don't want there to be squares that are
      // still holding onto pieces that used to be there
      // but are now empty
      square.piece = undefined;
      for (let piece of this.pieces) {
        if (piece.pos.equals(square.pos)) {
          // re-assign pieces to squares
          square.piece = piece;
          // assign square to piece
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

  getSelectedPiece() {
    for (let piece of this.pieces) {
      if (piece.selected) return piece;
    }
    return false; // when there are no selected pieces
  }

  getSquareUnderMouse() {
    for (let square of this.squares) {
      if (square.mouseOver) {
        return square;
      }
    }
    return null;
  }

  getSquareFromXYorVector(x, y) {
    if (x.constructor.name == "Vector") {
      for (let square of this.squares) {
        if (square.pos.equals(x)) return square;
      }
    } else {
      for (let square of this.squares) {
        if (square.pos.x == x && square.pos.y == y) return square;
      }
    }
  }

  mouseClicked() {
    }


  }
}