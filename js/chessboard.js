class ChessBoard {
  constructor(defaultPieces) {
    this.height = defaultPieces.length;
    this.width = defaultPieces[0].length;
    let smallerDimention = (windowHeight < windowWidth) ? windowHeight : windowWidth;
    this.size = floor(smallerDimention / this.height);
    this.pieces = [];
    this.squares = [];
    this.winner = undefined;
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
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

  gameOver(winner) {
    this.winner = winner;
  }

  switchCurrentMove() {
    currentMove = (currentMove == 'white') ? 'black' : 'white';
  }

  renderBoard() {
    for (let square of this.squares) {
      square.render();
    }
    for (let piece of this.pieces) {
      piece.render();
    }
  }

  updateSquares() {
    for (let square of this.squares) {
      // set check status to false
      square.blackCheck = false;
      square.whiteCheck = false;
      square.piecesCausingCheck = [];
      square.canBlackKingMoveHere = true;
      square.canWhiteKingMoveHere = true;
      square.debugMessage = '';
      square.color = square.defaultColor;
      square.specialEnPassantHighlight = false;
      // Turn off the highlighting of all squares
      square.highlight = false;
      // square.mayEnPassantTo = false;
      // un-assign pieces from squares
      // this is needed because
      // although there is a square for every piece,
      // there is NOT a piece for every square.
      // We don't want there to be squares that are
      // still holding onto pieces that used to be there
      // but are now empty
      square.piece = undefined;
      for (let piece of this.pieces) {
        if (!piece.live) {
          piece.square = null;
          continue;
        }
        if (piece.pos.equals(square.pos)) {
          // re-assign pieces to squares
          square.piece = piece;
          // assign square to piece
          square.piece.square = square;
          break;
        }
      }
    }
    for (let piece of this.pieces) {
      let validMoves = piece.getValidSquares();
      for (let square of validMoves) {
        if ((square.piece && square.piece.team != piece.team) || !square.piece) {
          square.piecesCausingCheck.push(piece);
          if (piece.team == 'white') {
            square.whiteCheck = true;
          } else {
            square.blackCheck = true;
          }
        }
      }
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
      square.updateMouseOver();
      if (square.mouseOver) {
        return square;
      }
    }
    return null;
  }

  /**
   * Returns the square at the specified (x, y) pair
   * @param {Number | Vector} x
   * @param {Number} y
   * @return {Square | undefined}
   */
  getSquareFromXYorVector(x, y) {
    if (typeof x != "number") {
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
    if (!clickedSquare) return;
    if (config.debug) console.log(clickedSquare);
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
      if (!clickedSquare.highlight && (clickedSquare.piece.team == currentMove || !config.enforceTurns)) {
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
        if (opponentPiece.type == 'king') this.gameOver(currentMove);
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
    this.updateSquares();


  }
}