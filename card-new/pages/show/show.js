// pages/agent/show/show.js
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
	onLoad: function(options) {
		var that = this;
		// 查看options是否有userID否则调用本地存储
		var userId = options.userId || wx.getStorageSync('agentId')
		if (userId) {
			this.getInfo(userId)
		}
	},
	//获取信息
	getInfo(id) {
		wx.showLoading({title:'努力加载中...'})
		setTimeout(function(){
			wx.hideLoading()
		},6000)
		var that = this;
		wx.request({
			url: `https://ii.sinelinked.com/tg_web/api/XCX/agent/search`,
			data: {
				agentId: id
			},
			success: function(res) {
				wx.hideLoading()

				var result = res.data[0]
				wx.setStorageSync('agentId', result.userId)
				wx.setStorageSync('phone', result.phone)

				// 个人秀封面如果存在就追加随机数防止缓存，否则使用默认图
				var selfShowCoverTemp = result.selfShowCover
				if (selfShowCoverTemp) {
          selfShowCoverTemp = selfShowCoverTemp + '&' + Math.random()
				} else {
					selfShowCoverTemp = 'http://ii.sinelinked.com/miniProgramAssets/show_bg.jpg' + '&' + Math.random()
				}

				// 个人秀多图加随机数//防止图片缓存
				var selfImgArr = []

				if (result.selfImg.length > 1) {
					that.setData({
						isManySelfImg: true
					})

				} else {
					that.setData({
						isManySelfImg: false
					})
				}

				for (var i = 0; i < result.selfImg.length; i++) {
          selfImgArr.push(result.selfImg[i] + '&' + Math.random())
				}

				that.setData({
					agentData: result,
					selfShowCover: selfShowCoverTemp,
          headImg: result.headImg + '&' + Math.random(),
					selfImg: selfImgArr
				})

			}
		})
	},
	// 全屏预览图片
	previewImages(e) {
		var that = this;
		wx.previewImage({
			current: e.currentTarget.dataset.item,
			urls: that.data.selfImg
			//       success: function () {
			//         wx.setStorageSync('account_id', that.data.agentShowData.data[0].id)
			//       }
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
		return {
			title: this.data.agentData.xcxTitle || '您的贴心保险顾问',
			path: '/pages/show/show?userId=' + this.data.agentData.userId,
			imageUrl: this.data.agentData.coverTempletUrl || this.data.imageUrl
		}
	}
})
