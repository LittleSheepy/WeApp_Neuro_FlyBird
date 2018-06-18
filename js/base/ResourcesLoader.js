import {Resources} from './Resources.js'

export class ResourcesLoader {
  constructor(){
    this.map = new Map(Resources)
    for (let [key, value] of this.map){
      var image = wx.createImage()
      image.src = value;
      this.map.set(key, image)
    }
  }

  onLoaded(callback){
    let loadedCount = 0;
    for(let value of this.map.values()){
      value.onload = () => {
        loadedCount++;
        if (loadedCount >= this.map.size){
          callback(this.map);
        }
      }
    }
  }

  static create(){
    return new ResourcesLoader();
  }
}