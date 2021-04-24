class Piece {
  constructor(type, team, pos, size) {
    this.type = type;
    this.team = team; // 'white' / 'black'
    this.live = true;
    this.selected = false;
    this.pos = pos; // p5 Vector
    this.imageLocation = 'imgs/' + this.team + '_' + this.type + '.png';
    this.icon = loadImage(this.imageLocation);
    this.size = size;
    this.hasMoved = false;
    this.startedAtTop = (this.pos.y < 4);

  }

  move(destination) {
    if (destination.equals(this.pos)) {
      chessBoard.updateSquares();
      return;
    }

    let destinationSquare = chessBoard.getSquareFromXYorVector(destination.x, destination.y);
    this.pos = destination;
    this.hasMoved = true;
    this.selected = false;
    if (this.mightEnPassant && destinationSquare.mayEnPassantTo) {
      // an En Passant was just performed.
      // Kill the piece we just passed
      let direction = this.startedAtTop ? 1 : -1;
      let passedSquare = chessBoard.getSquareFromXYorVector(this.pos.x, this.pos.y - direction);
      let passedPawn = passedSquare.piece;
      passedPawn.live = false;
    }
    chessBoard.updateSquares();
    chessBoard.switchCurrentMove();

  }

  validateMove(loc) {

  }

  render() {
    if (this.live) {
      // For when i fix the chess images:
      // image(this.icon, this.pos.x * this.size, this.pos.y * this.size, this.icon.width / 2, this.icon.height / 2);
      image(this.icon, this.pos.x * this.size, this.pos.y * this.size, this.size, this.size);
      if (this.selected) {
        let possibleSquares = this.getValidSquares();
        for (let square of possibleSquares) {
          square.highlight = true;
        }
      }
    }
    // else { // If it's not live, remove it from the piece array
    //   for (let i = 0; i < chessBoard.pieces.length; i++) {
    //     if (chessBoard.pieces[i] == this) {
    //       chessBoard.pieces.splice(i, 1);
    //     }
    //   }
    // }
  }

  getValidSquares() {
    let x = this.pos.x;
    let y = this.pos.y;
    let coords = [];
    switch (this.type) {
      case 'pawn':
        // Can move 1 sq fwd
        // First move can be 2 sq fwd
        // Pawns can only move AWAY from the starting point

        let direction = this.startedAtTop ? 1 : -1;
        // Check one forward
        let newY = y + direction;
        let squareToBeChecked = chessBoard.getSquareFromXYorVector(x, newY);
        if (squareToBeChecked && (!squareToBeChecked.piece || squareToBeChecked.team == currentMove)) {
          coords.push([x, newY]);
          newY += direction;
          let squareToBeChecked = chessBoard.getSquareFromXYorVector(x, newY);
          if (squareToBeChecked && !squareToBeChecked.piece)
            if (!this.hasMoved) coords.push([x, newY]);
        }


        // check the piece of (x±1, y+direction)
        newY = y + direction;
        let newX = x + 1;
        // If there is a piece there
        squareToBeChecked = chessBoard.getSquareFromXYorVector(newX, newY);
        if (squareToBeChecked && squareToBeChecked.piece)
          coords.push([newX, newY]);

        newX = x - 1; // look on the other side
        // If there is a piece there
        squareToBeChecked = chessBoard.getSquareFromXYorVector(newX, newY);
        if (squareToBeChecked && squareToBeChecked.piece)
          coords.push([newX, newY]);

        this.mightEnPassant = false;
        if (this.type == 'pawn' && ((this.startedAtTop && this.pos.y == chessBoard.height - 4) || (!this.startedAtTop && this.pos.y == 3))) {
          // if we are in the En Passant rows:
          // check if there is an opponent piece directly next to us.
          newX = x + 1; // to the right
          squareToBeChecked = chessBoard.getSquareFromXYorVector(newX, y);
          // squareToBeChecked.mayEnPassantTo = false;
          if (squareToBeChecked &&
            squareToBeChecked.piece &&
            squareToBeChecked.piece.team != currentMove &&
            squareToBeChecked.piece.type == 'pawn') {
            this.mightEnPassant = true;
            // Special statement to color piece
            // in danger of being captured via En Passant
            squareToBeChecked.mayEnPassantTo = true;
            chessBoard.getSquareFromXYorVector(newX, y + direction).mayEnPassantTo = true;
            coords.push([newX, y + direction]);
            // we have to let the square know that if the move is taken, kill the residing piece
          }
          newX = x - 1; // to the left
          squareToBeChecked = chessBoard.getSquareFromXYorVector(newX, y);
          // squareToBeChecked.mayEnPassantTo = false;
          if (squareToBeChecked &&
            squareToBeChecked.piece &&
            squareToBeChecked.piece.team != currentMove &&
            squareToBeChecked.piece.type == 'pawn') {
            this.mightEnPassant = true;
            // Special statement to color piece
            // in danger of being captured via En Passant
            squareToBeChecked.mayEnPassantTo = true;
            chessBoard.getSquareFromXYorVector(newX, y + direction).mayEnPassantTo = true;
            coords.push([newX, y + direction]);
            // we have to let the square know that if the move is taken, kill the residing piece
          }

        }

        break;
      case 'rook':
        // Can move vert and hori in any dir
        // until stopped by a piece or game edge


        // Start at the rook going up (-Y)
        for (let i = y; i >= 0; i--) {
          let square = chessBoard.getSquareFromXYorVector(x, i);
          if (square.piece && square.piece != this) {
            if (square.piece.team != currentMove) coords.push([x, i]);
            break;
          }
          coords.push([x, i]);
        }

        // Start at the rook going down (+Y)
        for (let i = y; i < chessBoard.height; i++) {
          let square = chessBoard.getSquareFromXYorVector(x, i);
          if (square.piece && square.piece != this) {
            if (square.piece.team != currentMove) coords.push([x, i]);
            break;
          }
          coords.push([x, i]);
        }


        // Start at the rook going right (+X)
        for (let i = x; i < chessBoard.width; i++) {
          let square = chessBoard.getSquareFromXYorVector(i, y);
          if (square.piece && square.piece != this) {
            if (square.piece.team != currentMove) coords.push([i, y]);
            break;
          }
          coords.push([i, y]);
        }


        // Start at the rook going down (-Y)
        for (let i = x; i >= 0; i--) {
          let square = chessBoard.getSquareFromXYorVector(i, y);
          if (square.piece && square.piece != this) {
            if (square.piece.team != currentMove) coords.push([i, y]);
            break;
          }
          coords.push([i, y]);
        }

        break;
      case 'knight':
        // either 2 Horizontal and 1 Vertical
        // or     1 Horizontal and 2 Vertical
        let possibilities = [
          [1, 2],
          [2, 1],
          [2, -1],
          [1, -2],
          [-1, -2],
          [-2, -1],
          [-2, 1],
          [-1, 2]
        ];
        for (let pair of possibilities) {
          let newX = x + pair[0];
          let newY = y + pair[1];
          coords.push([newX, newY]);
        }
        break;
      case 'bishop':
        // Can move diag in any dir until
        // stopped by a piece or game edge
        let continuBishopeRightUp = true;
        let continueRBishopightDown = true;
        let continBishopueLeftUp = true;
        let continueBishopLeftDown = true;
        for (let xOffset = 0; xOffset < chessBoard.width; xOffset++) {
          if (continueRBishopightDown) {
            let yOffset = xOffset;
            let newX = x + xOffset;
            let newY = y + yOffset;
            let square = chessBoard.getSquareFromXYorVector(newX, newY);

            if (square && square.piece && square.piece != this) {
              if (square.piece.team != currentMove) coords.push([newX, newY]);
              continueRBishopightDown = false;
            }
            coords.push([newX, newY]);
          }
          if (continueBishopLeftDown) {
            let yOffset = xOffset;
            let newX = x - xOffset;
            let newY = y + yOffset;
            let square = chessBoard.getSquareFromXYorVector(newX, newY);
            if (square && square.piece && square.piece != this) {
              if (square.piece.team != currentMove) coords.push([newX, newY]);
              continueBishopLeftDown = false;
            }
            coords.push([newX, newY]);
          }
          if (continuBishopeRightUp) {
            let yOffset = xOffset;
            let newX = x + xOffset;
            let newY = y - yOffset;
            let square = chessBoard.getSquareFromXYorVector(newX, newY);
            if (square && square.piece && square.piece != this) {
              if (square.piece.team != currentMove) coords.push([newX, newY]);
              continuBishopeRightUp = false;
            }
            coords.push([newX, newY]);
          }
          if (continBishopueLeftUp) {
            let yOffset = xOffset;
            let newX = x - xOffset;
            let newY = y - yOffset;
            let square = chessBoard.getSquareFromXYorVector(newX, newY);
            if (square && square.piece && square.piece != this) {
              if (square.piece.team != currentMove) coords.push([newX, newY]);
              continBishopueLeftUp = false;
            }
            coords.push([newX, newY]);
          }

        }
        break;
      case 'king':
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            let newX = i + x;
            let newY = j + y;
            // check if that piece is in check by other team
            let square = chessBoard.getSquareFromXYorVector(newX, newY);
            if (square && square.piecesCausingCheck.length > 0) {
              // if we are white, check for blackCheck, and vice vesa
              if (!(this.team == 'white' ? !square.blackCheck : square.whiteCheck)) {
                continue;
              }
            }
            coords.push([newX, newY]);
          }
        }
        // Can move 1 sq in any direction
        // UNLESS that square is in check
        break;
      case 'queen':
        // Castling:
        // Both king and queen must be unmoved
        // board must be 8x8
        // copy ROOK code and BISHOP code
        // ROOK:
        // Start at the Queen going up (-Y)
        let continueInDirection = true;
        for (let i = y; i >= 0; i--) {
          let square = chessBoard.getSquareFromXYorVector(x, i);
          if (square.piece) {
            if (this.team == 'white') {
              square.canBlackKingMoveHere = false;
            } else {
              square.canWhiteKingMoveHere = false;
            }
            if (square.piece.team != this.team && continueInDirection) {
              coords.push([x, i]);
              continueInDirection = false;
            }
          } else {
            coords.push([x, i]);
          }
        }
        // Start at the Queen going down (+Y)
        continueInDirection = true;
        for (let i = y; i < chessBoard.height; i++) {
          let square = chessBoard.getSquareFromXYorVector(x, i);
          if (square.piece) {
            if (this.team == 'white') {
              square.canBlackKingMoveHere = false;
            } else {
              square.canWhiteKingMoveHere = false;
            }
            if (square.piece.team != this.team && continueInDirection) {
              coords.push([x, i]);
              continueInDirection = false;
            }
          } else {
            coords.push([x, i]);
          }
        }
        // Start at the Queen going right (+X)
        continueInDirection = true;
        for (let i = x; i < chessBoard.width; i++) {
          let square = chessBoard.getSquareFromXYorVector(i, y);
          if (square.piece) {
            if (this.team == 'white') {
              square.canBlackKingMoveHere = false;
            } else {
              square.canWhiteKingMoveHere = false;
            }
            if (square.piece.team != this.team && continueInDirection) {
              coords.push([i, y]);
              continueInDirection = false;
            }
          } else {
            coords.push([i, y]);
          }
        }
        // Start at the Queen going down (-Y)
        continueInDirection = true;
        for (let i = x; i >= 0; i--) {
          let square = chessBoard.getSquareFromXYorVector(i, y);
          if (square.piece) {
            if (this.team == 'white') {
              square.canBlackKingMoveHere = false;
            } else {
              square.canWhiteKingMoveHere = false;
            }
            if (square.piece.team != this.team && continueInDirection) {
              coords.push([i, y]);
              continueInDirection = false;
            }
          } else {
            coords.push([i, y]);
          }
        }

        // BISHOP:
        // Can move diag in any dir until
        // stopped by a piece or game edge
        let continueQueenRightUp = true;
        let continueQueenRightDown = true;
        let continueQueenLeftUp = true;
        let continueQueenLeftDown = true;
        let yOffset;
        let square;
        for (let xOffset = 0; xOffset < chessBoard.width; xOffset++) {
          yOffset = xOffset;
          let newX = x + xOffset;
          let newY = y + yOffset;
          square = chessBoard.getSquareFromXYorVector(newX, newY);
          if (square) {
            if (this.team == 'white') {
              square.canBlackKingMoveHere = false;
            } else {
              square.canWhiteKingMoveHere = false;
            }
          }
          if (continueQueenRightDown) {

            if (square && square.piece && square.piece != this) {
              if (square.piece.team != currentMove) coords.push([newX, newY]);
              continueQueenRightDown = false;
            }
            coords.push([newX, newY]);
          }
          yOffset = xOffset;
          newX = x - xOffset;
          newY = y + yOffset;
          square = chessBoard.getSquareFromXYorVector(newX, newY);
          if (square) {
            if (this.team == 'white') {
              square.canBlackKingMoveHere = false;
            } else {
              square.canWhiteKingMoveHere = false;
            }
          }
          if (continueQueenLeftDown) {
            if (square && square.piece && square.piece != this) {
              if (square.piece.team != currentMove) coords.push([newX, newY]);
              continueQueenLeftDown = false;
            }
            coords.push([newX, newY]);
          }
          yOffset = xOffset;
          newX = x + xOffset;
          newY = y - yOffset;
          square = chessBoard.getSquareFromXYorVector(newX, newY);
          if (square) {
            if (this.team == 'white') {
              square.canBlackKingMoveHere = false;
            } else {
              square.canWhiteKingMoveHere = false;
            }
          }
          if (continueQueenRightUp) {
            if (square && square.piece && square.piece != this) {
              if (square.piece.team != currentMove) coords.push([newX, newY]);
              continueQueenRightUp = false;
            }
            coords.push([newX, newY]);
          }
          yOffset = xOffset;
          newX = x - xOffset;
          newY = y - yOffset;
          square = chessBoard.getSquareFromXYorVector(newX, newY);
          if (square) {
            if (this.team == 'white') {
              square.canBlackKingMoveHere = false;
            } else {
              square.canWhiteKingMoveHere = false;
            }
          }
          if (continueQueenLeftUp) {
            if (square && square.piece && square.piece != this) {
              if (square.piece.team != currentMove) coords.push([newX, newY]);
              continueQueenLeftUp = false;
            }
            coords.push([newX, newY]);
          }

        }
        break;
    }
    let squares = [];
    for (let pair of coords) {
      x = pair[0];
      y = pair[1];
      // This is where to check if it goes off the board or
      // into another piece.
      if (x < 0 || y < 0 || x >= chessBoard.width || y >= chessBoard.height) continue;
      let square = chessBoard.getSquareFromXYorVector(x, y);
      if (square.piece && square.piece.team == currentMove) continue;
      squares.push(square);
    }
    return squares;
  }

}