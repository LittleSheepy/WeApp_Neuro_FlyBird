var Text = function(){
  var self = this;
  self.options = {
    Func:function(){
      console.log("执行 Func")
    }
  }
  self.TextFunc = function(){
    console.log("执行 TextFunc")
  }
}

module.exports = Text