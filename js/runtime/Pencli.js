import { Sprite } from '../base/Sprite.js'

export class Pencli extends Sprite{
  constructor(img,top){
    let system = wx.getSystemInfoSync();
    super(
      img,
      0,
      0,
      img.width,
      img.height,
      system.windowWidth,
      0,
      img.width,
      img.height
    )
    this.top = top;
  }

  draw(){
    this.x = this.x - 2;
    super.draw(
      this.img,
      0,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }
}