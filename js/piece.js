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

  move(loc) {

  }

  validateMove(loc) {

  }

  render() {
    image(this.icon, this.pos.x * this.size, this.pos.y * this.size, this.size, this.size);
    if (this.selected) {
      let possibleSquares = this.getValidSquares();
      for (let square of possibleSquares) {
        square.highlight = true;
      }
    }
  }

  getValidSquares() {
    let x = this.pos.x;
    let y = this.pos.y;
    let squares = [];
    switch (this.type) {
      case 'pawn':
        squares.push(chessBoard.getSquareFromXY(x, y - 1));
        break;
    }

    return squares;
  }

}