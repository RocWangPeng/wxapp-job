const app = getApp()
let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		current: 'mine',
		tabBar: '',
		cardInfo:{},//当前名片信息
		cardList: [], //名片列表
		activeIndex: 0, //当前名片索引
		activeCardId: '', //当前名片id
		userId: '', //当前登陆用户userId
		spinShow: true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		wx.setNavigationBarTitle({
			title: '个人中心'
		})
		this.setData({
			tabBar: app.globalData.tabBar.person,
		})
	},
	// tabBar切换
	handleChange({
		detail
	}) {
		var tabBarData = app.globalData.tabBar.person
		var routeType = getCurrentPages().length >= 9 ? 'reLaunch' : 'navigateTo'
		tabBarData.map((item) => {
			if (detail.key == item.key) {
				wx[routeType]({
					url: item.url
				})
			}
		})
	},
	toMoreCard() {
		wx.navigateTo({
			url: '/pages/admin/person/mine/moreCard/moreCard'
		})
	},
	// 获取名片列表
	getCardList() {

		utils.request(utils.personApi + '/personal/get/card/List', 'GET')
			.then(res => {
				if (res.code == 0) {
					if (res.data.cardList.length == 0) {
						//还没有名片
					} else {
						var cardList = res.data.cardList.splice(0, 2)
						var cardHeadUrl = 'cardList[' + 0 + '].cardHeadUrl'
						if (cardList[0].cardHeadUrl) {
							this.setData({
								cardList: cardList,
								cardInfo:cardList[0],
								activeCardId: cardList[0].id,
								[cardHeadUrl]: cardList[0].cardHeadUrl + '&' + Math.random()
							})
						} else {
							this.setData({
								cardList: cardList,
								activeCardId: cardList[0].id,
								[cardHeadUrl]: 'http://ii.sinelinked.com/miniProgramAssets/defaultHeadImg.jpg'
							})
						}
						wx.setStorageSync('cardHeadUrl', this.data.cardList[0].cardHeadUrl + '&' + Math.random())
						wx.setStorageSync('cardId', this.data.activeCardId)
						wx.setStorageSync('activeCardId', this.data.activeCardId)

					}
				}
				// 隐藏spin
				setTimeout(() => {
					this.setData({
						spinShow: false
					})
				}, 100)
			})
	},
	// 获取名片信息
	cardByInfoType(cardId) {
		var data = {
			id: cardId,
			infoType: 1
		}

		utils.request(utils.personApi + '/personal/get/cardByInfoType', 'GET', data)
			.then(res => {
				if (res.code == 0 && res.data.info) {
					res.data.info.cardHeadUrl = res.data.info.cardHeadUrl + '&' + Math.random()
					this.setData({
						cardInfo:res.data.info,
						activeCardId: res.data.info.id,
					})
					wx.setStorageSync('cardHeadUrl', res.data.info.cardHeadUrl)
					wx.setStorageSync('cardId', res.data.info.id)
					wx.setStorageSync('activeCardId', res.data.info.id)
				}
				// 隐藏spin
				setTimeout(() => {
					this.setData({
						spinShow: false
					})
				}, 100)
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
		
		var cardId = wx.getStorageSync('cardId')
		if(cardId){
			this.cardByInfoType(cardId)
		}else{
			this.getCardList()
		}
		
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

})
