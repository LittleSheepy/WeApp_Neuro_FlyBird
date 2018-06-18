import { Sprite } from '../base/Sprite.js'
import { Director } from '../Director.js'

export class Land extends Sprite {
  constructor(){
    let system = wx.getSystemInfoSync();
    let img = Sprite.getImage('land');
    super(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      system.windowHeight - img.height,
      img.width,
      img.height
    );
    this.landX = 0;
    this.LandSpeed = Director.getInstance().moveSpeed;
    this.system = system;
  }

  draw(){
    this.landX = this.landX + this.LandSpeed;
    if (this.landX >= this.img.width - this.system.windowWidth){
      this.landX = 0;
    }
    super.draw(
      this.img,
      this.srcX,
      this.srcY,
      this.srcW,
      this.srcH,
      -this.landX,
      this.y,
      this.width,
      this.height
    )
  }
}