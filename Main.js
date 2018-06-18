import { ResourcesLoader } from './js/base/ResourcesLoader.js'
import { BackGround } from './js/runtime/BackGround.js'
import { Land } from './js/runtime/Land.js'
import { DataStore } from './js/base/DataStore.js'
import { Director } from './js/Director.js'
import { Birds } from './js/player/Birds.js'
import { StartButton } from './js/player/StartButton.js'
import { Score } from './js/player/Score.js'
import { Audio} from './js/runtime/Audio.js'
export class Main {
  constructor() {
    this.canvas = wx.createCanvas()
    //console.log(this.canvas.width, this.canvas.height)
    this.ctx = this.canvas.getContext('2d')
    this.dataStore = DataStore.getInstance()
    this.director = Director.getInstance()
    this.audios = Audio.getInstance()
    const loader = ResourcesLoader.create()
    loader.onLoaded(map => this.onResourcesFirstLoaded(map))
  }
  
  onResourcesFirstLoaded(map) {
    this.dataStore.ctx = this.ctx;
    this.dataStore.res = map;
    this.dataStore.audios = this.audios.audios
    this.init()
  }

  init(){
    //console.log("in init函数") 
    this.director.isGameOver = false
    this.dataStore.put('background', BackGround);
    this.dataStore.put('land', Land);
    this.dataStore.put('penclis',[])
    for (let i = 0; i < 50; i++) {
      this.dataStore.put('birds'+i, Birds)
    }
    this.dataStore.put('birds', Birds)
    this.dataStore.put('startButton', StartButton)
    this.dataStore.put('score', Score)
    this.director.createPencli()
    this.registerEvent()
    this.director.run()
    //console.log("out init函数")
  }

  registerEvent(){
    wx.onTouchStart((e) => {
      //console.log("onTouchStart")
      console.log(e.touches)
      if(this.director.isGameOver){
        this.init()
      }else{
        this.director.birdsEvent()
      }
    })
    wx.onTouchMove(function (e) {
      //console.log("onTouchMove " + e.touches)
    })

    wx.onTouchEnd(function (e) {
      //console.log("onTouchEnd " + e.touches)
    })

    wx.onTouchCancel(function (e) {
      //console.log("onTouchCancel")
      //console.log(e.touches)
    })
  }
}