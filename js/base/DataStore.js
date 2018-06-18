export class DataStore {
  static getInstance(){
    if (!DataStore.instance){
      DataStore.instance = new DataStore()
    }
    return DataStore.instance
  }

  constructor(){
    this.map = new Map()
  }

  put(key,value){
    //console.log("====in put " + key + " " + this.map.get(key))
    if(typeof value === 'function'){
      value = new value()
    }
    this.map.set(key,value)
    //console.log("====out put " + key + " " + this.map.get(key))
    return this.map
  }

  get(key){
    //console.log("~~~~get " + key + " " + this.map.get(key))
    return this.map.get(key)
  }

  destory(){
    for(let value of this.map.values()){
      value = null;
    }
  }

}