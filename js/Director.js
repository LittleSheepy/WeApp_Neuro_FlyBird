import { DataStore } from './base/DataStore.js'
import { PencliUp } from '../js/runtime/PencliUp.js'
import { PencliDown } from '../js/runtime/PencliDown.js'

var Neuroevolution = require("../Neuroevolution.js")
var Neuvol = new Neuroevolution()
export class Director {
  static getInstance(){
    if(!Director.instance){
      Director.instance = new Director();
    }
    return Director.instance
  }
  
  constructor(){
    this.dataStore = DataStore.getInstance()
    this.moveSpeed = 2;
    this.gen = Neuvol.nextGeneration();
  }
  
  createPencli(){
    let systemHeight = wx.getSystemInfoSync().windowHeight;
    let minPencilY = systemHeight / 8;
    let maxPencil = systemHeight / 2;
    let top = minPencilY + Math.random() * ( maxPencil - minPencilY )
    this.dataStore.get('penclis').push(new PencliUp(top))
    this.dataStore.get('penclis').push(new PencliDown(top))
  }

  birdsEvent(){
    var bird = this.dataStore.get('birds')
    for(let i = 0; i <= 2; i++){
      bird.y[i] = bird.birdsY[i];
    }
    bird.time = 0;
  } 

  // 判断撞击
  static isStrike(bird, pencil){
    let s = false;
    if(bird.top > pencil.bottom || bird.bottom < pencil.top || bird.right < pencil.left || bird.left > pencil.right){
        s = true;
    }
    return !s;
  }

  check(){
    const birds = this.dataStore.get('birds');
    const land = this.dataStore.get('land');
    const pencils = this.dataStore.get('penclis')
    const score = this.dataStore.get('score')
    if (birds.birdsY[0] + birds.birdsHeight[0] >= land.y){
        this.isGameOver = true;
        return
    }

    const birdsBorder = {
      top:birds.y[0],
      bottom:birds.birdsY[0]+birds.birdsHeight[0],
      left:birds.birdsX[0],
      right:birds.birdsX[0] + birds.birdsWidth[0]
    }

    for(let i = 0; i< pencils.length; i++ ){
      const pencil = pencils[i];
      const pencilBorder = {
        top:pencil.y,
        bottom:pencil.y + pencil.height,
        left:pencil.x,
        right:pencil.x + pencil.width
      }

      if (Director.isStrike(birdsBorder, pencilBorder)){
        this.isGameOver = true;
        return
      }
    }
    if (birds.birdsX[0] > pencils[0].x + pencils[0].width && score.isScore){
      score.isScore = false;
      score.scoreNumber++;
      
    }
  }

  run(){
    this.check()
    if (!this.isGameOver){
      this.dataStore.get('background').draw()
      let windowWidth = wx.getSystemInfoSync().windowWidth;
      let penclis = this.dataStore.get('penclis');
      if (penclis[0].x <= -penclis[0].width && penclis.length === 4) {
        penclis.shift()
        penclis.shift()
        this.dataStore.get('score').isScore = true;
      }
      if (penclis[0].x <= ((windowWidth - penclis[0].width) / 2) && penclis.length === 2) {
        this.createPencli()
      }
      this.dataStore.get('penclis').forEach((value) => {
        value.draw()
      })
      this.dataStore.get('land').draw()
      this.dataStore.get('birds').draw()
      this.dataStore.get('score').draw()
      
      let timer = requestAnimationFrame(() => this.run())
      this.dataStore.put('timer',timer)
    }else{
      this.dataStore.get('startButton').draw()
      cancelAnimationFrame(this.dataStore.get('timer'))
      this.dataStore.destory()
      wx.triggerGC()
    }
  }
}