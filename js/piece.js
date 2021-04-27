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
    if (config.renderPieces && this.live) {
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
          coords.push({
            x: x,
            y: newY
          });
          newY += direction;
          let squareToBeChecked = chessBoard.getSquareFromXYorVector(x, newY);
          if (squareToBeChecked && !squareToBeChecked.piece)
            if (!this.hasMoved) coords.push({
              x: x,
              y: newY
            });
        }


        // check the piece of (x±1, y+direction)
        newY = y + direction;
        let newX = x + 1;
        // If there is a piece there
        squareToBeChecked = chessBoard.getSquareFromXYorVector(newX, newY);
        if (squareToBeChecked && squareToBeChecked.piece)
          coords.push({
            x: newX,
            y: newY
          });

        newX = x - 1; // look on the other side
        // If there is a piece there
        squareToBeChecked = chessBoard.getSquareFromXYorVector(newX, newY);
        if (squareToBeChecked && squareToBeChecked.piece)
          coords.push({
            x: newX,
            y: newY
          });

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
            squareToBeChecked.specialEnPassantHighlight = this.selected ? true : false;
            squareToBeChecked.mayEnPassantTo = true;
            chessBoard.getSquareFromXYorVector(newX, y + direction).mayEnPassantTo = true;
            coords.push({
              x: newX,
              y: y + direction
            });
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
            squareToBeChecked.specialEnPassantHighlight = this.selected ? true : false;
            squareToBeChecked.mayEnPassantTo = true;
            chessBoard.getSquareFromXYorVector(newX, y + direction).mayEnPassantTo = true;
            coords.push({
              x: newX,
              y: y + direction
            });
            // we have to let the square know that if the move is taken, kill the residing piece
          }

        }

        break;
      case 'rook':
        // Can move vert and hori in any dir
        // until stopped by a piece or game edge
        let rookHorizontal = {
          right: true,
          rightCheck: true,
          left: true,
          leftCheck: true,
          up: true,
          upCheck: true,
          down: true,
          downCheck: true,
        };

        // Start at the rook going up (-Y)
        for (let i = y; i >= 0; i--) {
          let square = chessBoard.getSquareFromXYorVector(x, i);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (rookHorizontal.up) {
              if (square.piece) {
                rookHorizontal.up = false;
                if (square.piece.type != 'king') {
                  rookHorizontal.upCheck = false;
                }
              }
              coords.push({
                x: x,
                y: i
              });
            }
            if (rookHorizontal.upCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }
        }

        // Start at the rook going down (+Y)
        for (let i = y; i < chessBoard.height; i++) {
          let square = chessBoard.getSquareFromXYorVector(x, i);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (rookHorizontal.down) {
              if (square.piece) {
                rookHorizontal.down = false;
                if (square.piece.type != 'king') {
                  rookHorizontal.downCheck = false;
                }
              }
              coords.push({
                x: x,
                y: i
              });
            }
            if (rookHorizontal.downCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }
        }


        // Start at the rook going right (+X)
        for (let i = x; i < chessBoard.width; i++) {
          let square = chessBoard.getSquareFromXYorVector(i, y);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (rookHorizontal.right) {
              if (square.piece) {
                rookHorizontal.right = false;
                if (square.piece.type != 'king') {
                  rookHorizontal.rightCheck = false;
                }
              }
              coords.push({
                x: i,
                y: y
              });
            }
            if (rookHorizontal.rightCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }
        }


        // Start at the rook going left (-Y)
        for (let i = x; i >= 0; i--) {
          let square = chessBoard.getSquareFromXYorVector(i, y);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (rookHorizontal.up) {
              if (square.piece) {
                rookHorizontal.up = false;
                if (square.piece.type != 'king') {
                  rookHorizontal.upCheck = false;
                }
              }
              coords.push({
                x: i,
                y: y
              });
            }
            if (rookHorizontal.upCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }
        }

        break;
      case 'knight':
        // either 2 Horizontal and 1 Vertical
        // or     1 Horizontal and 2 Vertical
        let knightPossibilities = [
          [1, 2],
          [2, 1],
          [2, -1],
          [1, -2],
          [-1, -2],
          [-2, -1],
          [-2, 1],
          [-1, 2]
        ];
        for (let pair of knightPossibilities) {
          let newX = x + pair[0];
          let newY = y + pair[1];
          let square = chessBoard.getSquareFromXYorVector(newX, newY);
          if (square) {
            if (this.team == 'white') {
              square.canBlackKingMoveHere = false;
            } else {
              square.canWhiteKingMoveHere = false;
            }
          }
          coords.push({
            x: newX,
            y: newY
          });
        }
        break;
      case 'bishop':
        // Can move diag in any dir until
        // stopped by a piece or game edge
        let bishopDiagonal = {
          rightDown: true,
          rightDownCheck: true,
          leftDown: true,
          leftDownCheck: true,
          rightUp: true,
          rightUpCheck: true,
          leftUp: true,
          leftUpCheck: true,
        };

        for (let offset = 0; offset < chessBoard.width; offset++) {
          // Right Down
          let newX = x + offset; // Right (+X)
          let newY = y + offset; // Down  (+Y)
          let square = chessBoard.getSquareFromXYorVector(newX, newY);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (bishopDiagonal.rightDown) {
              square.debugMessage = offset;
              if (square.piece) {
                bishopDiagonal.rightDown = false;
                if (square.piece.type != 'king') {
                  bishopDiagonal.rightDownCheck = false;
                }
              }
              coords.push({
                x: newX,
                y: newY
              });
            }
            if (bishopDiagonal.rightDownCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }

          // Left Down
          newX = x - offset; // Left (-X)
          newY = y + offset; // Down (+Y)
          square = chessBoard.getSquareFromXYorVector(newX, newY);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (bishopDiagonal.leftDown) {
              square.debugMessage = offset;
              if (square.piece) {
                bishopDiagonal.leftDown = false;
                if (square.piece.type != 'king') {
                  bishopDiagonal.leftDownCheck = false;
                }
              }
              coords.push({
                x: newX,
                y: newY
              });
            }
            if (bishopDiagonal.leftDownCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }

          // Right Up
          newX = x + offset; // Right (+X)
          newY = y - offset; // Up    (-Y)
          square = chessBoard.getSquareFromXYorVector(newX, newY);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (bishopDiagonal.rightUp) {
              square.debugMessage = offset;
              if (square.piece) {
                bishopDiagonal.rightUp = false;
                if (square.piece.type != 'king') {
                  bishopDiagonal.rightUpCheck = false;
                }
              }
              coords.push({
                x: newX,
                y: newY
              });
            }
            if (bishopDiagonal.rightUpCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }

          // Left Up
          newX = x - offset; // Left (-X)
          newY = y - offset; // Up   (-Y)
          square = chessBoard.getSquareFromXYorVector(newX, newY);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (bishopDiagonal.leftUp) {
              square.debugMessage = offset;
              if (square.piece) {
                bishopDiagonal.leftUp = false;
                if (square.piece.type != 'king') {
                  bishopDiagonal.leftUpCheck = false;
                }
              }
              coords.push({
                x: newX,
                y: newY
              });
            }
            if (bishopDiagonal.leftUpCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }
        }
        break;
      case 'king':
        // Can move 1 sq in any direction
        // UNLESS that square is in check
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            let newX = i + x;
            let newY = j + y;
            // check if that piece is in check by other team
            let square = chessBoard.getSquareFromXYorVector(newX, newY);
            if (square) {
              // if we are white, check for blackCheck, and vice vesa
              if (!((this.team == 'white' && square.canWhiteKingMoveHere) || (this.team == 'black' && square.canBlackKingMoveHere))) {
                continue;
              }
            }
            coords.push({
              x: newX,
              y: newY
            });
          }
        }
        // Castling
        // King must not have moved before
        if (this.hasMoved) break;
        // check the corner squares in our row.
        // they must both contain rooks that have not yet moved
        // Queen side castle
        let square = chessBoard.getSquareFromXYorVector(0, y);
        if (!(square.piece && square.piece.type == 'rook' && !square.piece.hasMoved)) break;
        // Check between our position and the queenside rook, make sure each sq
        // King side castle
        square = chessBoard.getSquareFromXYorVector(chessBoard.width - 1, y);
        if (!(square.piece && square.piece.type == 'rook' && !square.piece.hasMoved)) break;

        break;
      case 'queen':
        // Can move vert and hori in any dir
        // until stopped by a piece or game edge
        // Start at the queen going up (-Y)
        let queenHorizontal = {
          right: true,
          rightCheck: true,
          left: true,
          leftCheck: true,
          up: true,
          upCheck: true,
          down: true,
          downCheck: true,
        };

        // Start at the queen going up (-Y)
        for (let i = y; i >= 0; i--) {
          let square = chessBoard.getSquareFromXYorVector(x, i);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (queenHorizontal.up) {
              if (square.piece) {
                queenHorizontal.up = false;
                if (square.piece.type != 'king') {
                  queenHorizontal.upCheck = false;
                }
              }
              coords.push({
                x: x,
                y: i
              });
            }
            if (queenHorizontal.upCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }
        }

        // Start at the queen going down (+Y)
        for (let i = y; i < chessBoard.height; i++) {
          let square = chessBoard.getSquareFromXYorVector(x, i);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (queenHorizontal.down) {
              if (square.piece) {
                queenHorizontal.down = false;
                if (square.piece.type != 'king') {
                  queenHorizontal.downCheck = false;
                }
              }
              coords.push({
                x: x,
                y: i
              });
            }
            if (queenHorizontal.downCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }
        }


        // Start at the queen going right (+X)
        for (let i = x; i < chessBoard.width; i++) {
          let square = chessBoard.getSquareFromXYorVector(i, y);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (queenHorizontal.right) {
              if (square.piece) {
                queenHorizontal.right = false;
                if (square.piece.type != 'king') {
                  queenHorizontal.rightCheck = false;
                }
              }
              coords.push({
                x: i,
                y: y
              });
            }
            if (queenHorizontal.rightCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }
        }


        // Start at the queen going left (-Y)
        for (let i = x; i >= 0; i--) {
          let square = chessBoard.getSquareFromXYorVector(i, y);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (queenHorizontal.up) {
              if (square.piece) {
                queenHorizontal.up = false;
                if (square.piece.type != 'king') {
                  queenHorizontal.upCheck = false;
                }
              }
              coords.push({
                x: i,
                y: y
              });
            }
            if (queenHorizontal.upCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }
        }

        // Diagonal

        // The way check works is:
        // if the king is in a square that can be
        // captured in the next turn, it is in check


        let queenDiagonal = {
          rightDown: true,
          rightDownCheck: true,
          leftDown: true,
          leftDownCheck: true,
          rightUp: true,
          rightUpCheck: true,
          leftUp: true,
          leftUpCheck: true,
        };

        for (let offset = 0; offset < chessBoard.width; offset++) {
          // Right Down
          let newX = x + offset; // Right (+X)
          let newY = y + offset; // Down  (+Y)
          let square = chessBoard.getSquareFromXYorVector(newX, newY);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (queenDiagonal.rightDown) {
              square.debugMessage = offset;
              if (square.piece) {
                queenDiagonal.rightDown = false;
                if (square.piece.type != 'king') {
                  queenDiagonal.rightDownCheck = false;
                }
              }
              coords.push({
                x: newX,
                y: newY
              });
            }
            if (queenDiagonal.rightDownCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }

          // Left Down
          newX = x - offset; // Left (-X)
          newY = y + offset; // Down (+Y)
          square = chessBoard.getSquareFromXYorVector(newX, newY);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (queenDiagonal.leftDown) {
              square.debugMessage = offset;
              if (square.piece) {
                queenDiagonal.leftDown = false;
                if (square.piece.type != 'king') {
                  queenDiagonal.leftDownCheck = false;
                }
              }
              coords.push({
                x: newX,
                y: newY
              });
            }
            if (queenDiagonal.leftDownCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }

          // Right Up
          newX = x + offset; // Right (+X)
          newY = y - offset; // Up    (-Y)
          square = chessBoard.getSquareFromXYorVector(newX, newY);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (queenDiagonal.rightUp) {
              square.debugMessage = offset;
              if (square.piece) {
                queenDiagonal.rightUp = false;
                if (square.piece.type != 'king') {
                  queenDiagonal.rightUpCheck = false;
                }
              }
              coords.push({
                x: newX,
                y: newY
              });
            }
            if (queenDiagonal.rightUpCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }

          // Left Up
          newX = x - offset; // Left (-X)
          newY = y - offset; // Up   (-Y)
          square = chessBoard.getSquareFromXYorVector(newX, newY);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (queenDiagonal.leftUp) {
              square.debugMessage = offset;
              if (square.piece) {
                queenDiagonal.leftUp = false;
                if (square.piece.type != 'king') {
                  queenDiagonal.leftUpCheck = false;
                }
              }
              coords.push({
                x: newX,
                y: newY
              });
            }
            if (queenDiagonal.leftUpCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }
        }
        break;
      case 'star':
        let starHorizontal = {
          right: true,
          rightCheck: true,
          left: true,
          leftCheck: true,
          up: true,
          upCheck: true,
          down: true,
          downCheck: true,
        };

        // Start at the star going up (-Y)
        for (let i = y; i >= 0; i--) {
          let square = chessBoard.getSquareFromXYorVector(x, i);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (starHorizontal.up) {
              if (square.piece) {
                starHorizontal.up = false;
                if (square.piece.type != 'king') {
                  starHorizontal.upCheck = false;
                }
              }
              coords.push({
                x: x,
                y: i
              });
            }
            if (starHorizontal.upCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }
        }

        // Start at the star going down (+Y)
        for (let i = y; i < chessBoard.height; i++) {
          let square = chessBoard.getSquareFromXYorVector(x, i);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (starHorizontal.down) {
              if (square.piece) {
                starHorizontal.down = false;
                if (square.piece.type != 'king') {
                  starHorizontal.downCheck = false;
                }
              }
              coords.push({
                x: x,
                y: i
              });
            }
            if (starHorizontal.downCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }
        }


        // Start at the star going right (+X)
        for (let i = x; i < chessBoard.width; i++) {
          let square = chessBoard.getSquareFromXYorVector(i, y);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (starHorizontal.right) {
              if (square.piece) {
                starHorizontal.right = false;
                if (square.piece.type != 'king') {
                  starHorizontal.rightCheck = false;
                }
              }
              coords.push({
                x: i,
                y: y
              });
            }
            if (starHorizontal.rightCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }
        }


        // Start at the star going left (-Y)
        for (let i = x; i >= 0; i--) {
          let square = chessBoard.getSquareFromXYorVector(i, y);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (starHorizontal.up) {
              if (square.piece) {
                starHorizontal.up = false;
                if (square.piece.type != 'king') {
                  starHorizontal.upCheck = false;
                }
              }
              coords.push({
                x: i,
                y: y
              });
            }
            if (starHorizontal.upCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }
        }

        // Diagonal

        // The way check works is:
        // if the king is in a square that can be
        // captured in the next turn, it is in check


        let starDiagonal = {
          rightDown: true,
          rightDownCheck: true,
          leftDown: true,
          leftDownCheck: true,
          rightUp: true,
          rightUpCheck: true,
          leftUp: true,
          leftUpCheck: true,
        };

        for (let offset = 0; offset < chessBoard.width; offset++) {
          // Right Down
          let newX = x + offset; // Right (+X)
          let newY = y + offset; // Down  (+Y)
          let square = chessBoard.getSquareFromXYorVector(newX, newY);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (starDiagonal.rightDown) {
              square.debugMessage = offset;
              if (square.piece) {
                starDiagonal.rightDown = false;
                if (square.piece.type != 'king') {
                  starDiagonal.rightDownCheck = false;
                }
              }
              coords.push({
                x: newX,
                y: newY
              });
            }
            if (starDiagonal.rightDownCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }

          // Left Down
          newX = x - offset; // Left (-X)
          newY = y + offset; // Down (+Y)
          square = chessBoard.getSquareFromXYorVector(newX, newY);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (starDiagonal.leftDown) {
              square.debugMessage = offset;
              if (square.piece) {
                starDiagonal.leftDown = false;
                if (square.piece.type != 'king') {
                  starDiagonal.leftDownCheck = false;
                }
              }
              coords.push({
                x: newX,
                y: newY
              });
            }
            if (starDiagonal.leftDownCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }

          // Right Up
          newX = x + offset; // Right (+X)
          newY = y - offset; // Up    (-Y)
          square = chessBoard.getSquareFromXYorVector(newX, newY);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (starDiagonal.rightUp) {
              square.debugMessage = offset;
              if (square.piece) {
                starDiagonal.rightUp = false;
                if (square.piece.type != 'king') {
                  starDiagonal.rightUpCheck = false;
                }
              }
              coords.push({
                x: newX,
                y: newY
              });
            }
            if (starDiagonal.rightUpCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }

          // Left Up
          newX = x - offset; // Left (-X)
          newY = y - offset; // Up   (-Y)
          square = chessBoard.getSquareFromXYorVector(newX, newY);
          if (square && square != this.square) { // don't stop counting just because *we* are a piece in our path
            if (starDiagonal.leftUp) {
              square.debugMessage = offset;
              if (square.piece) {
                starDiagonal.leftUp = false;
                if (square.piece.type != 'king') {
                  starDiagonal.leftUpCheck = false;
                }
              }
              coords.push({
                x: newX,
                y: newY
              });
            }
            if (starDiagonal.leftUpCheck) {
              if (this.team == 'white') {
                square.canBlackKingMoveHere = false;
              } else {
                square.canWhiteKingMoveHere = false;
              }
            }
          }
        }
        // either 2 Horizontal and 1 Vertical
        // or     1 Horizontal and 2 Vertical
        let starPossibilities = [
          [1, 2],
          [2, 1],
          [2, -1],
          [1, -2],
          [-1, -2],
          [-2, -1],
          [-2, 1],
          [-1, 2]
        ];
        for (let pair of starPossibilities) {
          let newX = x + pair[0];
          let newY = y + pair[1];
          let square = chessBoard.getSquareFromXYorVector(newX, newY);
          if (square) {
            if (this.team == 'white') {
              square.canBlackKingMoveHere = false;
            } else {
              square.canWhiteKingMoveHere = false;
            }
          }
          coords.push({
            x: newX,
            y: newY
          });
        }
        break;
    }
    let squares = [];
    for (let pair of coords) {
      x = pair.x;
      y = pair.y;
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