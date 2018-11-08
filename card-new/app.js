//app.js
App({
  onLaunch: function (options) {


    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('https://api.weixin.qq.com/sns/jscode2session?appid=wx0ff73d8248085825&secret=afec6b29047303dfd234ddaa00b857c2&js_code=' + res.code + '&grant_type=authorization_code')
        console.log(res)
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx0ff73d8248085825&secret=afec6b29047303dfd234ddaa00b857c2&js_code=' + res.code + '&grant_type=authorization_code',
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            // openid = res.data.openid //返回openid
            console.log(res.data)
          }
        })
      }
    })
    
    
		// 首先判断有没有参数，如果没有参考 再判断本地是否存在数据
		var params = options.query.userId || options.query.scene
		if(!params){
      
			// 如果本地存储没有数据，则跳转到搜索顾问页面
			var userId = wx.getStorageSync('agentId')
     

			if(!userId){
				
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
		
	}
})