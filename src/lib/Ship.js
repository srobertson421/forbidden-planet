import Phaser from 'phaser'
import colors from './colors'
import helpers from './helpers'

export default class Ship {
  constructor (board, outerPoints, pos) {
    const spr = new Phaser.Graphics(board.game, 0, 0)
    this.spr = spr
    this.outerPoints = outerPoints
    this.extraPoints = board.createShape(0.9)

    this.spr.lineStyle(4, colors.MLIGHT)

    this.pos = pos
    this.drawShip(this.pos)

    board.add(this.spr)
  }

  nextPos () {
    this.pos = (this.pos + 1 === this.outerPoints.length ? 0 : this.pos + 1)
    this.drawShip(this.pos)
  }

  prevPos () {
    this.pos = (this.pos - 1 < 0 ? this.outerPoints.length - 1 : this.pos - 1)
    this.drawShip(this.pos)
  }

  drawShip (pos) {
    const pt1 = this.outerPoints[pos]
    const pt2 = helpers.next(this.outerPoints, pos)
    const midPoint = {
      x: (this.extraPoints[pos].x + helpers.next(this.extraPoints, pos).x) / 2,
      y: (this.extraPoints[pos].y + helpers.next(this.extraPoints, pos).y) / 2
    }

    this.spr.x = pt1.x
    this.spr.y = pt1.y

    this.spr.lineTo(midPoint.x - pt1.x, midPoint.y - pt1.y)
    this.spr.lineTo(pt2.x - pt1.x, pt2.y - pt1.y)
  }

  explode () {
  }

  update (step) {
    this.spr.x = this.path[step].x
    this.spr.y = this.path[step].y

    this.spr.angle += 5
    this.spr.scale.x = step * 5 / this.path.length
    this.spr.scale.y = step * 5 / this.path.length
  }
}
