// pages/agent/show/show.js
//获取应用实例
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		agentData: {}, //顾问信息
		selfShowCover: '', //个人秀封面
		headImg: '', //头像
		isManySelfImg: true, //个人秀是否多图
		selfImg: [], //个人秀多图
		shareTitle: '', //自定义转发标题
		imageUrl: '', //自定义转发封面
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var self = this;
		try {
			var agentData = wx.getStorageSync('agentData')
			if (agentData) {
				self.setData({
					agentData: agentData
				})

				// 个人秀多图加随机数//防止图片缓存
				var selfImgArr = []

				if (self.data.agentData.selfImg.length > 1) {
					self.setData({
						isManySelfImg: true
					})
				} else {
					self.setData({
						isManySelfImg: false
					})
				}

				for (var i = 0; i < self.data.agentData.selfImg.length; i++) {
					selfImgArr.push(self.data.agentData.selfImg[i] + '&' + Math.random())
				}
				self.setData({
					selfImg: selfImgArr
				})

			}
		} catch (e) {
			// Do something when catch error
		}


	},
	// 全屏预览图片
	previewImages(e) {
		var that = this;
		wx.previewImage({
			current: e.currentTarget.dataset.item,
			urls: that.data.selfImg
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: this.data.agentData.xcxTitle || '您的贴心保险顾问',
			path: '/pages/agent/show/show?userId=' + this.data.agentData.userId,
		}
	}
})