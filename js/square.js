class Square {
  constructor(pos, size) {
    this.pos = pos;
    this.x = pos.x;
    this.y = pos.y;
    this.size = size;
    this.highlight = false;
    if (( /*Both even*/ this.x % 2 == 0 && this.y % 2 == 0) || ( /*Both odd*/ this.x % 2 == 1 && this.y % 2 == 1)) {
      this.color = 'light';
    } else {
      this.color = 'dark';
    }
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
        fillColor = color(255, 0, 0);
    }
    if (this.highlight) fillColor = color(112, 162, 163);
    fill(fillColor);
    rect(this.pos.x * this.size, this.pos.y * this.size, this.size);
  }

}