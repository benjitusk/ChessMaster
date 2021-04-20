class ChessBoard {
  constructor(defaultPieces) {
    this.width = 8;
    this.height = 8;
    this.size = 90;
    this.pieces = [];
    this.squares = [];
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        let pos = createVector(j, i);
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
    // If there are highlighted squares,
    // it means that there is a selected piece

    // when a square is clicked:
    let clickedSquare = this.getSquareUnderMouse();
    let currentlySelectedPiece = this.getSelectedPiece();

    if (!clickedSquare.piece) {
      // if it's an empty square
      if (clickedSquare.highlight) {
        // If it's highlighted: (implying that there is a currently selected piece)
        // move the selected piece there,
        currentlySelectedPiece.move(clickedSquare.pos);

        // clear the selected piece.
        if (currentlySelectedPiece.selected) {
          currentlySelectedPiece.selected = false;
        }

        // reset all highlighted squares
        for (let square of this.squares) {
          square.highlight = false;
        }

      } else {
        // if it's empty and unhighlighted
        // clear the selected piece.
        if (currentlySelectedPiece.selected) {
          currentlySelectedPiece.selected = false;
        }
        // reset all highlighted squares
        for (let square of this.squares) {
          square.highlight = false;
        }
      }
    } else {
      // if there is a piece in the square
      if (!clickedSquare.highlight && clickedSquare.piece.team == currentMove) {
        // if it's unhighlighted, and the piece belongs to the turnholder:
        // clear the selected piece
        if (currentlySelectedPiece.selected) {
          currentlySelectedPiece.selected = false;
        }
        // reset all highlighted squares
        for (let square of this.squares) {
          square.highlight = false;
        }
        // select the piece
        clickedSquare.piece.selected = true;
      } else if (clickedSquare.piece.selected) {
        // if the piece is the same one we selected earlier
        // clear the selected piece
        if (currentlySelectedPiece.selected) {
          currentlySelectedPiece.selected = false;
        }

        // reset all highlighted squares
        for (let square of this.squares) {
          square.highlight = false;
        }
      } else if (clickedSquare.highlight && clickedSquare.piece.team != currentMove) {
        // ATTACK!
        // Kill the opponent
        let opponentPiece = clickedSquare.piece;
        opponentPiece.live = false;
        opponentPiece.square.piece = null;
        opponentPiece.square = null;

        // move the piece
        currentlySelectedPiece.move(clickedSquare.pos);

        // clear the selected piece.
        if (currentlySelectedPiece.selected) {
          currentlySelectedPiece.selected = false;
        }

        // reset all highlighted squares
        for (let square of this.squares) {
          square.highlight = false;
        }
      }
    }


  }
}