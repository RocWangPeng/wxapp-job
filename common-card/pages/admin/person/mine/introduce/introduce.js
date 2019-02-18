let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		introduce: '',
		cardId: '', //名片id
		isShow: 1, //是否展示
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var cardId = options.cardId
		if (cardId) {
			this.setData({
				cardId: cardId,
			})
			this.cardByInfoType(cardId)
		}
	},
	isShow() {
		var isShow = this.data.isShow == 1 ? '2' : 1
		this.setData({
			isShow: isShow
		})
		this.formSubmit()
	},
	// 获取名片信息
	cardByInfoType(cardId) {
		var data = {
			id: cardId,
			infoType: 2
		}
		utils.request(utils.personApi + '/personal/get/cardByInfoType', 'GET', data)
			.then(res => {
				if (res.code == 0) {
					this.setData({
						introduce: res.data.info.cardPersonalProfile == 'null' ? ' ' : res.data.info.cardPersonalProfile
					})
					if(res.data.info.cardProfileDisplayStatus){
						this.setData({
							isShow: res.data.info.cardProfileDisplayStatus,
						})
					}
				}
			})
	},
	bindshowDesc(e) {
		this.setData({
			introduce: e.detail.value,
		})
	},
	// 提交信息
	formSubmit(e) {
		var data = {
			'id': this.data.cardId,
			'cardPersonalProfile': this.data.introduce,
			'cardProfileDisplayStatus': this.data.isShow,
		}
		wx.showLoading({
		  title: '加载中',
		  mask:true
		})

		utils.request(utils.personApi + '/personal/update/card/profile', 'POST', data, 'application/x-www-form-urlencoded')
			.then(res => {
				wx.hideLoading()
				if (res.code == 0) {
					wx.showToast({
						title: '资料提交成功',
						icon: 'none',
						duration: 2000
					})
				} else {
					wx.showToast({
						title: res.error,
						icon: 'none',
						duration: 2000
					})
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
})
