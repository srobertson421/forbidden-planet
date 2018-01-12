import Colors from './colors'
import Phaser from 'phaser'
import RailMonster from './RailMonster'

const defaultPoints = [
  [1, 1], [2, 5], [1, 8], [3, 7], [8, 8], [8, 4], [7, 4], [8, 1], [4, 2]
]

let step = 0
const NUM_STEPS = 2000

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
    this.cornerlines.forEach((line) => {
      this.placeMonster(line)
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
    const op = this.outerPoints
    const ip = this.innerPoints

    for (var p = 0; p < op.length; p++) {
      cornerlines.push(new Phaser.Line(ip[p].x, ip[p].y, op[p].x, op[p].y))
    }

    this.cornerlines = cornerlines
    this._drawLines(cornerlines, Colors.LIGHT)
  }

  placeMonster (line) {
    const startPt = {
      x: line.start.x,
      y: line.start.y
    }
    const endPt = {
      x: line.end.x,
      y: line.end.y
    }

    const onFinish = () => {}

    this.monsters.push(new RailMonster(this, startPt, endPt, NUM_STEPS, onFinish))
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
      mo.update(step)
      if (step + 1 === NUM_STEPS) {
        step = 0
      } else {
        step += 1
      }
    })
  }

  render () {

  }
}
