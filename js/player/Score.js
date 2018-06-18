import { DataStore } from '../base/DataStore.js'

export class Score{
  constructor(){
    this.ctx = DataStore.getInstance().ctx;
    this.scoreNumber = 0;

    this.isScore = true;
  }

  draw(){
    const system = wx.getSystemInfoSync()

    this.ctx.font = '25px Arial';
    this.ctx.fillStyle = '#452e0b';
    this.ctx.fillText(
      this.scoreNumber,
      system.windowWidth / 2,
      system.windowHeight / 12,
      1000
    )
  }
}