import Colors from './colors'

const defaultPoints = [
  [1,1], [2, 5], [1,8], [3, 7], [8,8] , [8,4] , [7,4], [8, 1] , [4, 2]
];

const FACTOR = 80;
let cursors = null;
export default class Board {

  constructor(game, pointsArray = defaultPoints) {
    this.game = game;
    this.pointsArray = pointsArray.map((pt) => { return [pt[0] - 5, pt[1] - 5]});
    this.graphics = this.game.add.graphics(400,400);

    this.drawOuter();
    this.drawInner();
    this.drawCorners();

    cursors = game.input.keyboard.createCursorKeys();
  }

  drawOuter() {
    if (!this.outerPoints) {
      this.outerPoints = this.pointsArray.map((pt) => {
        return new Phaser.Point(pt[0]*FACTOR,pt[1]*FACTOR);
      });
    }

    this._drawLines(this._buildPoly(this.outerPoints), Colors.HI);
  }

  drawInner() {
    if (!this.innerPoints) {
      const SHRINK = FACTOR/3;
      const OFFSET = (FACTOR - SHRINK);
      this.innerPoints = this.pointsArray.map((pt) => {
        return new Phaser.Point(pt[0]*SHRINK + OFFSET/2,pt[1]*SHRINK + OFFSET/2);
      });
    }

    this._drawLines(this._buildPoly(this.innerPoints), Colors.MLIGHT);
  }

  _buildPoly(points) {
    const lines = [];
    for(var p = 0; p < points.length; p++) {
      const next = (p === points.length - 1 ? 0 : p + 1);
      lines.push(new Phaser.Line(points[p].x, points[p].y,points[next].x, points[next].y));
    }

    return lines;
  }

  _drawLines(lines, color) {
    this.graphics.lineStyle(1, color);

     lines.forEach((line) => {
       this.graphics.moveTo(line.start.x,line.start.y);//moving position of graphic if you draw mulitple lines
       this.graphics.lineTo(line.end.x,line.end.y);
     });

    return lines;
  }

  drawCorners() {
    const cornerlines = [];
    const op = this.outerPoints;
    const ip = this.innerPoints;
    for(var p = 0; p < op.length; p++) {
      cornerlines.push(new Phaser.Line(op[p].x, op[p].y,ip[p].x, ip[p].y));
    }

    this._drawLines(cornerlines, Colors.LIGHT);
  }

  update() {
    this.graphics.angle += -1;

    if(cursors.up.isDown) {
        this.graphics.scale.x += -0.01;
        this.graphics.scale.y += -0.01;
    } else if(cursors.down.isDown) {
        this.graphics.scale.x += 0.01;
        this.graphics.scale.y += 0.01;
    }  }

  render() {

  }

}
