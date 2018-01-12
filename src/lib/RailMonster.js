import Phaser from 'phaser'

export default class RailMonster {
  constructor (board, startPt, endPt, steps, onFinish) {
    const spr = board.create(0, 0, 'ball')
    spr.width = 5
    spr.height = 5
    spr.x = startPt.x
    spr.y = startPt.y
    this.spr = spr

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
  }
}
