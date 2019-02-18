var utils = require('../../../../utils/util.js')
//获取应用实例
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cardInfo: {}, //名片信息
		isManySelfImg: true, //个人秀是否多图
		selfImg: [], //个人秀多图
		cardForwardTitle:'',//转发标题
		cardForwardCoverUrl:'',//转发封面
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
			type: 3
		}
		utils.request(utils.personApi + '/personal/get/card/info', 'GET', data)
			.then((res) => {
				if (res.code == 0) {
					var cardInfo = res.data.info
					for (let val in cardInfo) {
						if (cardInfo[val] === null) {
							cardInfo[val] = ''
						}
					}
					
					const headImg = wx.getStorageSync('headImg')
					cardInfo.cardHeadUrl = headImg || 'http://ii.sinelinked.com/miniProgramAssets/defaultHeadImg.jpg'

					self.setData({
						cardInfo: cardInfo,
					})
					

					// 个人秀多图加随机数//防止图片缓存
					var selfImgArr = []
					if (self.data.cardInfo.cardShowPhotosUrls) {
						self.data.cardInfo.cardShowPhotosUrls = self.data.cardInfo.cardShowPhotosUrls.split('|')
					} else {
						self.data.cardInfo.cardShowPhotosUrls = []
					}
					
					console.log(self.data.cardInfo.cardShowPhotosUrls);
					
					if (self.data.cardInfo.cardShowPhotosUrls.length > 1) {
						self.setData({
							isManySelfImg: true
						})
					} else {
						self.setData({
							isManySelfImg: false
						})
					}

					for (var i = 0; i < self.data.cardInfo.cardShowPhotosUrls.length; i++) {
						if(self.data.cardInfo.cardShowPhotosUrls[i]){
							selfImgArr.push(self.data.cardInfo.cardShowPhotosUrls[i] + '&' + Math.random())
						}
					}
					self.setData({
						selfImg: selfImgArr
					})
					
					const cardForwardTitle = wx.getStorageSync('cardForwardTitle')
					const cardForwardCoverUrl = wx.getStorageSync('cardForwardCoverUrl')
					
					if(cardForwardTitle){
						self.setData({
							cardForwardTitle: cardForwardTitle
						})
					}
					if(cardForwardCoverUrl){
						self.setData({
							cardForwardCoverUrl: cardForwardCoverUrl
						})
					}

				}
				// 隐藏spin
				setTimeout(()=>{
					this.setData({spinShow:false})
				},250)
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
			title: this.data.cardForwardTitle,
			path: '/pages/card/person/show/show?cardId=' + this.data.cardInfo.id,
			imageUrl: this.data.cardForwardCoverUrl
		}
	}
})
