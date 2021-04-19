class Piece {
  constructor(type, team, pos) {
    this.type = type;
    this.team = team;
    this.live = true;
    this.selected = false;
    this.pos = pos;
  }
  move(loc) {

  }
  validateMove(loc) {

  }

  render() {
    // get image based off this.type then render it at this.pos
  }
}