//app.js
App({
  onLaunch: function (options) {
    console.log(options)
		// 首先判断有没有参数，如果没有参考 再判断本地是否存在数据
		var params = options.query.userId || options.query.scene
    if (params){
     wx.setStorageSync('userId', params)
    }
		
  },
	onShow(options){
    console.log(options)
	}
})