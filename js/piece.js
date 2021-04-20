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
    // check if opponent piece is there
    // this.pos = pos;
    if (destination.equals(this.pos)) {
      chessBoard.updateSquares();
      return;
    }

    this.pos = destination;
    this.hasMoved = true;
    this.selected = false;
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
  }

  getValidSquares() {
    let x = this.pos.x;
    let y = this.pos.y;
    let coords = [
      [x, y]
    ];
    switch (this.type) {
      case 'pawn':
        // Can move 1 sq fwd
        // First move can be 2 sq fwd
        // Pawns can only move AWAY from the starting point

        // IF THE PAWN CANNOT ATTACK:
        if (this.startedAtTop) {
          coords.push([x, y + 1]);
          if (!this.hasMoved) coords.push([x, y + 2]);
        } else {
          coords.push([x, y - 1]);
          if (!this.hasMoved) coords.push([x, y - 2]);
        }
        // Can ONLY attack 1 sq fwd-diag
        // IF THE PAWN CAN ATTACK THO...

        break;
      case 'rook':

        // Can move vert and hori in any dir
        // until stopped by a piece or game edge
        break;
      case 'knight':
        //
        break;
      case 'bishop':
        // Can move diag in any dir until
        // stopped by a piece or game edge
        break;
      case 'king':
        // Can move 1 sq in any direction
        // UNLESS that square is in check
        break;
      case 'queen':
        // Can move vert, hori, and diag in any
        // dir until stopped by piece or game edge
        break;
    }
    let squares = [];
    for (let pair of coords) {
      x = pair[0];
      y = pair[1];
      // This is where to check if it goes off the board or
      // into another piece.
      if (x < 0 || y < 0 || x > 8 || y > 8) continue;
      squares.push(chessBoard.getSquareFromXYorVector(x, y));
    }
    return squares;
  }

}