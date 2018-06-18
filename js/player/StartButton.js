import { Sprite } from '../base/Sprite.js'

export class StartButton extends Sprite{
  constructor(){
    const system = wx.getSystemInfoSync()
    const image = Sprite.getImage('startButton')
    super(
      image,
      0,
      0,
      image.width,
      image.height,
      (system.windowWidth - image.width) / 2,
      (system.windowHeight - image.height) / 2.5,
      image.width,
      image.height
    )
  }
}