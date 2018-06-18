export class Audio {
  static getInstance(){
    if (!Audio.instance){
      Audio.instance = new Audio()
    }
    return Audio.instance
  }
  constructor(){
    const res = {
      'bgm':{
        src:'/audios/bg_music.mp3',
        autoplay : false,
        loop : true
      },
      'socre':{
        src:'/audios/sfx_point.mp3',
        autoplay: true,
        loop: false
      }
    }

    this.audios = {}
    for (let value in res){
      const bgm = wx.createInnerAudioContext();
      bgm.autoplay = res[value].autoplay;
      bgm.loop = res[value].loop;
      bgm.src = res[value].src;
      this.audios[value] = bgm
    }
  }

  initAudio(){
    let count = 0;
    for (let value in this.audios) {
      this.audios[value].onCanplay(()=>{
        count ++
      })
      if (count == this.audios.length){
        return this.audios
      }
    }
  }

}