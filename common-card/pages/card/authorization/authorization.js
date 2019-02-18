let utils = require('../../../utils/util.js');
let wechat = require('../../../utils/wechat.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		wxCode: '',
		role: 1, //1个人 2团队
		spinShow: false,
		isScope: 2, //1已授权 2未授权
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		// 获取用户类型 
		// 		var role = options.role
		// 		if (role) {
		// 			this.setData({
		// 				role: role
		// 			})
		// 		}

	},
	// 授权窗口
	onGotUserInfo(res) {
		console.log(res);
		if (res.detail.errMsg == "getUserInfo:ok") {
			this.getUnineId()
		}
	},
	// 获取unionId
	getUnineId() {
		var self = this
		wechat.getUserInfo()
			.then(res => {
				var params = {
					encryptedData: res.encryptedData,
					iv: res.iv,
					code: res.code,
				}
				wechat.getUnineId(params)
					.then(res => {
						if (res.data.code == 0) {
							var unionId = res.data.data.unionId
							wx.setStorageSync('userUnionId', unionId)
							wx.navigateBack({
								delta: 1
							})
						}
					})
					.catch(err => {
						console.log(err);
					})
			}).catch(err => {
				console.log('未授权');
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
