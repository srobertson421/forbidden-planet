import Phaser from 'phaser'
import colors from './colors'

export default class RailMonster {
  constructor (board, startPt, endPt, steps, onFinish) {
    const spr = new Phaser.Graphics(board.game, 0, 0)
    spr.x = startPt.x
    spr.y = startPt.y
    this.spr = spr

    this.spr.lineStyle(1, colors.HI)
    this.spr.moveTo(-2, -2)// moving position of graphic if you draw mulitple lines
    this.spr.lineTo(3, 3)
    this.spr.moveTo(-2, 3)// moving position of graphic if you draw mulitple lines
    this.spr.lineTo(3, -2)
    board.add(this.spr)

    const path = []
    let pointsX = [startPt.x, endPt.x]
    let pointsY = [startPt.y, endPt.y]
    for (var r = 0; r <= 1; r += 1 / steps) {
      path.push({
        x: Phaser.Math.linearInterpolation(pointsX, r),
        y: Phaser.Math.linearInterpolation(pointsY, r)
      })
    }
    this.path = path
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
