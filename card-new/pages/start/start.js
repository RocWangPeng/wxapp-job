//获取应用实例
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isScope: true,
		inputValue: '',
		searchResult: [],
		isResult: '',
		resultTip: '请输入搜索内容'
	},
	search(e) {
		var type = e.target.dataset.type
		var url = ''
		if (type == 'agent') {
			url = 'http://ii.sinelinked.com/tg_web/api/agent/searchByNameOrTel'
		} else {
			url = 'http://ii.sinelinked.com/tg_web/api/team/searchByNameOrTel'
		}

		var self = this
		wx.request({
			url: url,
			data: {
				nameOrTel: this.data.inputValue
			},
			success(res) {
				if (res.data.data) {
					self.setData({
						searchResult: res.data.data
					})

					switch (res.data.data.length) {
						case 0:
							self.setData({
								resultTip: '没有搜索到相关内容'
							})
							break;
						case 1:
							// 顾问
							if (res.data.data[0].type == 1) {
								wx.reLaunch({
									url: '/pages/index/index?userId=' + res.data.data[0].userId
								})
							} else if (res.data.data[0].type == 2) {
								// 团队
								wx.navigateToMiniProgram({
									appId: 'wx45ab72d81dc8cd72',
									path: '/pages/index/index?userId=' + res.data.data[0].userId,
									success(res) {
										// 打开成功
									}
								})


							}
							break;
						default:
							self.setData({
								resultTip: '搜索结果大于一，请输入执业证书编号搜索'
							})
							break;
					}

				} else {
					self.setData({
						resultTip: '没有搜索到相关内容'
					})
				}

			}
		})
	},
	bindKeyInput: function(e) {
		this.setData({
			inputValue: e.detail.value
		})
	},
	onGotUserInfo: function(e) {
		console.log(e.detail.errMsg)
		console.log(e.detail.userInfo)
		console.log(e.detail.rawData)
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		if (app.globalData.userInfo) {
			this.setData({
				isScope: app.globalData.isScope,
			})
		} else {
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallbackScope = res => {
				this.setData({
					isScope: res,
				})
			}

		}
	},
	// 授权窗口
	onGotUserInfo(res){
		console.log(res);
		if(res.detail.errMsg == "getUserInfo:ok"){
			this.setData({
				isScope:1,
			})
		}
	},
	// 获取授权状态
	toAgent() {
		this.getUnineId()
	},
	getUnineId() {
		// 登录
		wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				var code = res.code
				var self = this;
				if (res.code) {
					// 获取用户信息
					wx.getSetting({
						success: res => {
							if (res.authSetting['scope.userInfo']) {
								// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
								wx.getUserInfo({
									success: res => {
										// 可以将 res 发送给后台解码出 unionId
										wx.request({
											url: "https://ii.sinelinked.com/tg_web/api/user/getUnionId",
											data: {
												encryptedData: res.encryptedData,
												iv: res.iv,
												code: code,
												type: 1
											},
											success(res) {
												// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
												// 所以此处加入 callback 以防止这种情况
												console.log('授权了');
											}
										})
									}
								})
							} else {
								console.log('未授权')
							}
						}
					})
				}
			}
		})
	},


	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {



	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
