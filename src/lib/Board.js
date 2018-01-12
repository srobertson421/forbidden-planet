import Colors from './colors'
import Phaser from 'phaser'

const defaultPoints = [
  [1, 1], [2, 5], [1, 8], [3, 7], [8, 8], [8, 4], [7, 4], [8, 1], [4, 2]
]

let step = 0

const FACTOR = 80
let cursors = null
const GAME_SIZE = 800

export default class Board extends Phaser.Group {
  constructor (game, pointsArray = defaultPoints) {
    super(game)
    this.pointsArray = pointsArray.map((pt) => { return [pt[0] - 5, pt[1] - 5] })
    this.graphics = new Phaser.Graphics(game, 0, 0)
    this.x = GAME_SIZE / 2
    this.y = GAME_SIZE / 2
    this.add(this.graphics)

    this.drawOuter()
    this.drawInner()
    this.drawConnectors()

    this.monsters = []

    defaultPoints.forEach(() => {
      this.placeMonster('ball')
    })
    //  cursors = game.state.input.keyboard.createCursorKeys()
  }

  drawOuter () {
    if (!this.outerPoints) {
      this.outerPoints = this.pointsArray.map((pt) => {
        return new Phaser.Point(pt[0] * FACTOR, pt[1] * FACTOR)
      })
    }

    this._drawLines(this._buildPoly(this.outerPoints), Colors.HI)
  }

  drawInner () {
    if (!this.innerPoints) {
      const SHRINK = FACTOR / 3
      const OFFSET = (FACTOR - SHRINK)
      this.innerPoints = this.pointsArray.map((pt) => {
        return new Phaser.Point(pt[0] * SHRINK + OFFSET / 2, pt[1] * SHRINK + OFFSET / 2)
      })
    }

    this._drawLines(this._buildPoly(this.innerPoints), Colors.MLIGHT)
  }

  _buildPoly (points) {
    const lines = []
    for (var p = 0; p < points.length; p++) {
      const next = (p === points.length - 1 ? 0 : p + 1)
      lines.push(new Phaser.Line(points[p].x, points[p].y, points[next].x, points[next].y))
    }

    return lines
  }

  _drawLines (lines, color) {
    this.graphics.lineStyle(1, color)

    lines.forEach((line) => {
      this.graphics.moveTo(line.start.x, line.start.y)// moving position of graphic if you draw mulitple lines
      this.graphics.lineTo(line.end.x, line.end.y)
    })

    return lines
  }

  drawConnectors () {
    const cornerlines = []
    const innerPaths = []
    const op = this.outerPoints
    const ip = this.innerPoints
    var resolution = 1 / 200

    for (var p = 0; p < op.length; p++) {
      cornerlines.push(new Phaser.Line(op[p].x, op[p].y, ip[p].x, ip[p].y))

      innerPaths[p] = []
      let pointsX = [ip[p].x, op[p].x]
      let pointsY = [ip[p].y, op[p].y]
      for (var r = 0; r <= 1; r += resolution) {
        innerPaths[p].push({
          x: Phaser.Math.linearInterpolation(pointsX, r),
          y: Phaser.Math.linearInterpolation(pointsY, r)
        })
      }
    }

    this.innerPaths = innerPaths

    this._drawLines(cornerlines, Colors.LIGHT)
  }

  placeMonster (image) {
    const spr = this.create(0, 0, 'ball')
    this.monsters.push(spr)
    spr.width = 5
    spr.height = 5
    const i = this.monsters.length - 1
    spr.x = this.innerPaths[i][step].x
    spr.y = this.innerPaths[i][step].y
  }

  update () {
    this.angle += -0.3

    // if (cursors.up.isDown) {
    //   this.scale.x += -0.01
    //   this.scale.y += -0.01
    // } else if (cursors.down.isDown) {
    //   this.scale.x += 0.01
    //   this.scale.y += 0.01
    // }

    this.monsters.forEach((mo, i) => {
      if (this.innerPaths.length) {
        mo.x = this.innerPaths[i][step].x
        mo.y = this.innerPaths[i][step].y
        if (step + 1 === this.innerPaths[i].length) {
          step = 0
        } else {
          step += 1
        }
      }
    })
  }

  render () {

  }
}
