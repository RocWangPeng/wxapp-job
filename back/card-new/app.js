//app.js
let wechat = require('./utils/wechat.js');
App({


	onLaunch: function(options) {
		var self = this
		// 验证是否已授权
		wechat.isAuth()
			.then(res => {
				
				if (this.readCallBackFn) {
					this.readCallBackFn(1)
				}

				this.globalData.isScope = 1
				wechat.login()
					.then(res => {
						// console.log(res);
					})
					.catch(err => {
						console.log(err);
					})
			})
			.catch(err => {
				this.globalData.isScope = 2
				if (this.readCallBackFn) {
					this.readCallBackFn(2)
				}

			})




		// this.getUnineId()


	},
	getUnineId() {
		// 登录
		wx.login({
			success: res => {
				console.log(res)
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				var code = res.code
				var self = this;
				if (res.code) {
					// 获取用户信息
					wx.getSetting({
						success: res => {
							if (res.authSetting['scope.userInfo']) {

								self.globalData.isScope = 1
								// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
								wx.getUserInfo({
									success: res => {
										// 可以将 res 发送给后台解码出 unionId
										console.log(res)
										wx.request({
											url: "https://ii.sinelinked.com/tg_web/api/user/getUnionId",
											data: {
												encryptedData: res.encryptedData,
												iv: res.iv,
												code: code,
												type: 1
											},
											success(res) {
												self.globalData.userInfo = res.data.data
												// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
												// 所以此处加入 callback 以防止这种情况
												if (self.userInfoReadyCallback) {
													self.userInfoReadyCallback(res)
												}
											}
										})
									}
								})
							} else {
								console.log('未授权')
								if (self.userInfoReadyCallbackScope) {
									self.userInfoReadyCallbackScope(2)
								}
							}
						}
					})
				}
			}
		})
	},
	onShow(options) {

	},
	globalData: {
		userInfo: null,
		isScope: null
	}
})
