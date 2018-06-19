import { DataStore } from './base/DataStore.js'
import { PencliUp } from '../js/runtime/PencliUp.js'
import { PencliDown } from '../js/runtime/PencliDown.js'
import { Birds } from './player/Birds.js'
var Neuroevolution = require("../Neuroevolution.js")
var Neuvol = new Neuroevolution({
  population: 50,
  network: [2, [2], 1],
})
export class Director {
  static getInstance(){
    if(!Director.instance){
      Director.instance = new Director();
    }
    return Director.instance
  }
  
  constructor(){
    this.gen = [];
    this.dataStore = DataStore.getInstance()
    this.moveSpeed = 2;
    this.gen = Neuvol.nextGeneration();
    this.NextPencilHigh = 0;
    this.Holls = [];
    this.score = 0;
    this.alives = 0;
  }
  
  createPencli(){
    let systemHeight = wx.getSystemInfoSync().windowHeight;
    let minPencilY = systemHeight / 8;
    let maxPencil = systemHeight / 2;
    let gap = systemHeight / 5;
    let top = minPencilY + Math.random() * ( maxPencil - minPencilY )
    this.Holls.push(top + gap)
    this.dataStore.get('penclis').push(new PencliUp(top))
    this.dataStore.get('penclis').push(new PencliDown(top))
  }

  birdsEvent(bird){
    var b = this.dataStore.get('birds')
    if (bird){
      b = bird
    }
    for(let i = 0; i <= 2; i++){
      b.y[i] = b.birdsY[i];
    }
    b.time = 1;
  } 

  // 判断撞击
  static isStrike(bird, pencil){
    let s = false;
    if(bird.top > pencil.bottom || bird.bottom < pencil.top || bird.right < pencil.left || bird.left > pencil.right){
        s = true;
    }
    return !s;
  }

  check(b) {
    var birds = this.dataStore.get('birds');
    if (b) {
      birds = b
    }
    const land = this.dataStore.get('land');
    const pencils = this.dataStore.get('penclis')
    const score = this.dataStore.get('score')
    if (birds.birdsY[0] + birds.birdsHeight[0] >= land.y) {
      this.isGameOver = true;
      return
    }

    const birdsBorder = {
      top: birds.birdsY[0],
      bottom: birds.birdsY[0] + birds.birdsHeight[0],
      left: birds.birdsX[0],
      right: birds.birdsX[0] + birds.birdsWidth[0]
    }

    for (let i = 0; i < pencils.length; i++) {
      const pencil = pencils[i];
      const pencilBorder = {
        top: pencil.y,
        bottom: pencil.y + pencil.height,
        left: pencil.x,
        right: pencil.x + pencil.width
      }

      if (Director.isStrike(birdsBorder, pencilBorder)) {
        this.isGameOver = true;
        return
      }
    }
    if (birds.birdsX[0] > pencils[0].x + pencils[0].width && score.isScore) {
      score.isScore = false;
      score.scoreNumber++;
      this.Holls.shift()
    }
  }
  isDead(birds) {
    const land = this.dataStore.get('land');
    const pencils = this.dataStore.get('penclis')
    const score = this.dataStore.get('score')
    if (birds.birdsY[0] + birds.birdsHeight[0] >= land.y
      || birds.birdsY[0] <= 0
    ) {
      this.isGameOver = true;
      return
    }

    const birdsBorder = {
      top: birds.birdsY[0],
      bottom: birds.birdsY[0] + birds.birdsHeight[0],
      left: birds.birdsX[0],
      right: birds.birdsX[0] + birds.birdsWidth[0]
    }

    for (let i = 0; i < pencils.length; i++) {
      const pencil = pencils[i];
      const pencilBorder = {
        top: pencil.y,
        bottom: pencil.y + pencil.height,
        left: pencil.x,
        right: pencil.x + pencil.width
      }

      if (Director.isStrike(birdsBorder, pencilBorder)) {
        return true
      }
    }
    return false
  }
  isItEnd(){
    for (let i = 0; i < 50; i++) {
      var bird = this.dataStore.get('birds' + i)
      if (bird.alive) {
        return false;
      }
    }
    return true;
  }
  update(){
    var self = this;
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
    var nextHoll = this.Holls[0];
    for (let i = 0; i < 50; i++) {
      var bird = this.dataStore.get('birds'+i)
      if (bird.alive == true){
        var inputs = [
          bird.birdsY[0],
          nextHoll
        ];

        var res = this.gen[i].compute(inputs);
        if (res > 0.5) {
          this.birdsEvent(bird)
        }

        bird.draw();
        const birdsBorder = {
          top: bird.birdsY[0],
          bottom: bird.birdsY[0] + bird.birdsHeight[0],
          left: bird.birdsX[0],
          right: bird.birdsX[0] + bird.birdsWidth[0]
        }


        if (this.isDead(bird) != false) {
          bird.alive = false;
          this.alives--;
          //console.log(this.alives);
          Neuvol.networkScore(this.gen[i], this.score);
          if (this.isItEnd()) {
            this.start();
          }
        }
      }
    } 
    this.score++;
    setTimeout(() => this.update(), 1)
  }
  start(){
    console.log("开始")
    this.dataStore.put('penclis', [])
    this.createPencli()
    this.score = 0;
    this.alives = 0;
    for (let i = 0; i < 50; i++) {
      this.dataStore.put('birds' + i, Birds)
    }
    setTimeout(() => this.update(),1)
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