//app.js
App({
  onLaunch: function (options) {
		// 首先判断有没有参数，如果没有参考 再判断本地是否存在数据
		var params = options.query.userId || options.query.scene
		if(!params){
			// 如果本地存储没有数据，则跳转到搜索顾问页面
			var userId = wx.getStorageSync('agentId')
			if(!userId){
				console.log('应该跳转');
				wx.reLaunch({
					url: '/pages/start/start',
					success: function () {
						console.log('home 跳转成功');
					},
					fail: function () {
						console.log('home 跳转失败');
					}
				})
			}else{
			}
		}
  },
	onShow(options){
    var params = options.query.userId
    console.log('app', options)
    if (params){
        wx.setStorageSync('NewagentId', params)
      }
	}
})