/* globals __DEV__ */
import Phaser from 'phaser'
import Board from '../Board'

export default class extends Phaser.State {

  init () {}
  preload () {}

  create () {
    this.board = new Board(this.game);
  }

  render () {
    this.board.render();

    if (__DEV__) {
    }
  }

  update () {
    this.board.update();
  }
}
