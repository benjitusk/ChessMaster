class Square {
  constructor(pos, size) {
    this.pos = pos;
    this.x = pos.x;
    this.y = pos.y;
    this.size = size;
    this.piece = undefined;
    this.debugMessage = '';
    this.highlight = false;
    this.whiteCheck = false;
    this.blackCheck = false;
    this.mayEnPassantTo = false;
    this.canWhiteKingMoveHere = true;
    this.canBlackKingMoveHere = false;
    this.piecesCausingCheck = [];
    if (( /*Both even*/ this.x % 2 == 0 && this.y % 2 == 0) || ( /*Both odd*/ this.x % 2 == 1 && this.y % 2 == 1)) {
      this.defaultColor = 'light';
    } else {
      this.defaultColor = 'dark';
    }
    this.color = this.defaultColor;
  }

  render() {
    // make an if statement that checks if the mouse is within the bounds of the square.
    // If it's true, tint the box or something
    if (mouseX > this.pos.x * this.size &&
      mouseX < (this.pos.x + 1) * this.size &&
      mouseY > this.pos.y * this.size &&
      mouseY < (this.pos.y + 1) * this.size) {
      this.mouseOver = true;
    } else {
      this.mouseOver = false;
    }
    let fillColor;
    switch (this.color) {
      case 'light':
        fillColor = color(238, 238, 210);
        break;
      case 'dark':
        fillColor = color(118, 150, 86);
        break;
      default:
        fillColor = color(this.color);
    }
    // if (this.highlight) fillColor = color(255, 0, 0);
    fill(fillColor);
    rect(this.pos.x * this.size, this.pos.y * this.size, this.size);
    if (this.highlight && config.highlightPotentialKills && this.piece && this.piece.team != currentMove) {
      // currentMove breaks when rule enforcement is off
      fill(color(262, 177, 153));
      rect(this.pos.x * this.size, this.pos.y * this.size, this.size);
    }
    if (this.mayEnPassantTo) {
      // fill(color(255, 0, 0, 50));
      // rect(this.pos.x * this.size, this.pos.y * this.size, this.size);

    }
    if (this.highlight && config.showPossibleMoves) {
      if (this.piece && this.piece.selected) return;
      fillColor = color(100, 100);
      fill(fillColor);
      circle((this.pos.x * this.size) + this.size / 2, (this.pos.y * this.size) + this.size / 2, this.size / 3);
    }
    if (config.showCoordinates) {
      fill(0);
      text("(" + this.pos.x + "," + this.pos.y + ")", this.pos.x * this.size + this.size / 2, this.pos.y * this.size + this.size / 2);
    }
    if (config.showAllSquaresInCheck) {
      if (this.whiteCheck) {
        fill(255, 0, 0, 127);
        circle((this.pos.x * this.size) + this.size / 2, (this.pos.y * this.size) + this.size / 2, this.size / 3);
      }
      if (this.blackCheck) {
        fill(0, 0, 255, 127);
        circle((this.pos.x * this.size) + this.size / 2, (this.pos.y * this.size) + this.size / 2, this.size / 3);
      }
    }
  }

}