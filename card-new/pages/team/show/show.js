// pages/agent/show/show.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		agentData: {}, //顾问信息
		selfShowCover: '', //个人秀封面
		headImg: '', //头像
		selfImg: [], //个人秀多图
		shareTitle: '', //自定义转发标题
		imageUrl: '', //自定义转发封面
		isManySelfImg: true, //个人秀是否多图
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		wx.showLoading({title:'努力加载中...'})
		var that = this;
		// 查看options是否有userID否则调用本地存储
		var teamId = options.teamId || wx.getStorageSync('teamId')
		if (teamId) {
			this.getInfo(teamId)
		}
	},
	//获取信息
	getInfo(teamId) {
		var that = this;
		wx.request({
			url: `https://ii.sinelinked.com/tg_web/api/XCX/team/search`,
			data: {
				teamId: teamId
			},
			success: function(res) {
				wx.hideLoading()
				var result = res.data[0]
				wx.setStorageSync('agentId', result.userId)
				wx.setStorageSync('phone', result.phone)


				// 个人秀多图加随机数//防止图片缓存
				var selfImgArr = []

				if (result.teamImg.length > 1) {
					that.setData({
						isManySelfImg: true
					})

				} else {
					that.setData({
						isManySelfImg: false
					})
				}

				for (var i = 0; i < result.teamImg.length; i++) {
          selfImgArr.push(result.teamImg[i] + '&' + Math.random())
				}

				that.setData({
					agentData: result,
          headImg: result.headImg + '&' + Math.random(),
					selfImg: selfImgArr
				})
				
				// 用户如果没有传头像，赋默认值
				if(!that.data.agentData.headImg){
					var headImg = 'agentData.headImg'
					that.setData({
						[headImg]: 'http://ii.sinelinked.com/miniProgramAssets/headImg.jpg'
					})
				}

			}
		})
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
			path: '/pages/team/show/show?userId=' + this.data.agentData.userId,
		}
	}
})
