import Colors from './colors'

const defaultPoints = [
  [1,1], [2, 5], [1,8], [3, 7], [8,8] , [8,4] , [7,4], [8, 1] , [4, 2]
];

const FACTOR = 80;
export default class Board {

  constructor(game, pointsArray = defaultPoints) {
    this.game = game;
    this.pointsArray = pointsArray;
    this.graphics = this.game.add.graphics(0,0);
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
      const OFFSET = 5*(FACTOR - SHRINK);
      this.innerPoints = this.pointsArray.map((pt) => {
        return new Phaser.Point(pt[0]*SHRINK + OFFSET,pt[1]*SHRINK + OFFSET);
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
    if (this.outerPoints) {
      this.outerPoints.forEach( (pt) => {
        pt.rotate(5*FACTOR, 5*FACTOR, 1, true);
      });

      this.innerPoints.forEach( (pt) => {
        pt.rotate(5*FACTOR, 5*FACTOR, 1, true);
      });
    }
  }

  render() {
    // erase previous ?!?
    this.graphics.beginFill(0x000000);
    this.graphics.drawPolygon(0,0,0,800,800,800,800,0);
    this.graphics.endFill();

    // draw rotated
    this.drawOuter();
    this.drawInner();
    this.drawCorners();



  }

}
