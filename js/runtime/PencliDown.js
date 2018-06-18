import { Pencli } from './Pencli.js'
import { Sprite } from '../base/Sprite.js'

export class PencliDown extends Pencli {
  constructor(top) {
    let img = Sprite.getImage('pencilDown')
    super(img,top)
  }

  draw(){
    let windowHeight = wx.getSystemInfoSync().windowHeight;
    let gap = windowHeight / 5;
    this.y = this.top + gap
    super.draw()
  }
}