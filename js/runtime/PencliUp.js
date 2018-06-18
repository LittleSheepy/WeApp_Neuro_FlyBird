import { Pencli } from './Pencli.js'
import { Sprite } from '../base/Sprite.js'

export class PencliUp extends Pencli {
  constructor(top) {
    let img = Sprite.getImage('pencilUp')
    super(img, top)
  }

  draw(){
    this.y = this.top -this.height;
    super.draw()
  }
}