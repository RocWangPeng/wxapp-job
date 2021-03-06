var utils = require('../../../../utils/util.js')
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		cardInfo: {}, //名片信息
		cardForwardTitle: '', //转发标题
		cardForwardCoverUrl: '' ,//转发封面
		spinShow:true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var self = this
		var scenes = decodeURIComponent(options.scene)
		var cardId = options.cardId || scenes.split('=')[1]
		if (cardId) {
			this.getInfo(cardId)
		}
	},
	//获取信息
	getInfo(cardId) {
		var self = this;
		var data = {
			cardId: cardId,
			type: 4
		}
		utils.requestTeam(utils.teamApi + '/team/get/cardInfoByType', 'GET', data)
			.then((res) => {
				if (res.code == 0) {
					var cardInfo = res.data.info
					for (let val in cardInfo) {
						if (cardInfo[val] === null) {
							cardInfo[val] = ''
						}
					}
					const headImg = wx.getStorageSync('headImgTeam')
					cardInfo.cardHeadUrl = headImg || 'http://ii.sinelinked.com/miniProgramAssets/defaultHeadImg.jpg'

					self.setData({
						cardInfo: cardInfo,
					})

					const cardForwardTitle = wx.getStorageSync('cardForwardTitleTeam')
					const cardForwardCoverUrl = wx.getStorageSync('cardForwardCoverUrlTeam')

					if (cardForwardTitle) {
						self.setData({
							cardForwardTitle: cardForwardTitle
						})
					}
					if (cardForwardCoverUrl) {
						self.setData({
							cardForwardCoverUrl: cardForwardCoverUrl
						})
					}


				}
				// 隐藏spin
				setTimeout(()=>{
					this.setData({spinShow:false})
				},150)
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
			title: this.data.cardForwardTitle,
			path: '/pages/card/team/introduce/introduce?cardId=' + this.data.cardInfo.id,
			imageUrl: this.data.cardForwardCoverUrl
		}
	}
})
