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
		var that = this;
		var self = this;
		wx.showNavigationBarLoading()
    try {
      var teamData = wx.getStorageSync('teamData')
      if (teamData) {
        // Do something with return value
				self.setData({agentData:teamData})

					// 个人秀多图加随机数//防止图片缓存
					var selfImgArr = []

					if (self.data.agentData.teamImg.length > 1) {
						that.setData({
							isManySelfImg: true
						})
	
					} else {
						that.setData({
							isManySelfImg: false
						})
					}
	
					for (var i = 0; i < self.data.agentData.teamImg.length; i++) {
						selfImgArr.push(self.data.agentData.teamImg[i] + '&' + Math.random())
					}
	
					that.setData({
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
	onReady: function() {
		wx.hideNavigationBarLoading()
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
			path: '/pages/team/show/show?teamId=' + this.data.agentData.userId,
		}
	}
})
