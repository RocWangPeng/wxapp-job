let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cardId: '', //名片id
		cardDisplayTeamsStatus: true, //名片：展示自己的团队标识：0-展示  1-不展示
		cardSystemSearchStatus: true, //名片：是否允许名片被系统搜索: 0-允许 1-不允许
		cardOthersDetailsStatus: true, //名片：是否允许非本团队成员查看详情：0-允许 1-不允许
		cardWhiteMsgStatus: false, //名片：是否只接收白名单消息：0-否  1-是
		whitelistCount:0
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
			this.getWhiteList(cardId)
		}
	},
	onChange(event) {
		const detail = event.detail;
		var name = event.currentTarget.dataset.name
		this.setData({
			[name]: detail.value
		})
		this.formSubmit()
	},
	// 获取名片信息
	cardByInfoType(cardId) {
		var data = {
			id: cardId,
			infoType: 6
		}
		utils.request(utils.personApi + '/personal/get/cardByInfoType', 'GET', data)
			.then(res => {
				if (res.code == 0) {
					let { 
						cardDisplayTeamsStatus,
						cardSystemSearchStatus,
						cardOthersDetailsStatus,
						cardWhiteMsgStatus
					} = res.data.info
					console.log(cardDisplayTeamsStatus);
					this.setData({
						cardDisplayTeamsStatus: cardDisplayTeamsStatus == 0 ? true : false,
						cardSystemSearchStatus: cardSystemSearchStatus == 0 ? true : false,
						cardOthersDetailsStatus: cardOthersDetailsStatus == 0 ? true : false,
						cardWhiteMsgStatus: cardWhiteMsgStatus == 0 ? false : true,
					})
				}
			})
	},
	  // 查询个人白名单列表
	getWhiteList(cardId){
		  var data = {
			  cardId:cardId
		  }
		utils.request(utils.personApi + '/personal/get/white/list', 'GET',data)
			.then(res=>{
				if(res.code == 0){
					var totalNum = res.data.whistList.totalNum
						this.setData({
							whitelistCount:totalNum
						})
				}
			})
	},
	formSubmit() {
		var data = {
			'id': this.data.cardId,
			'cardDisplayTeamsStatus': this.data.cardDisplayTeamsStatus? 0 : 1,
			'cardSystemSearchStatus': this.data.cardSystemSearchStatus? 0 : 1,
			'cardOthersDetailsStatus': this.data.cardOthersDetailsStatus? 0 : 1,
			'cardWhiteMsgStatus': this.data.cardWhiteMsgStatus? 1 : 0,
		}

		utils.request(utils.personApi + '/personal/update/card/config', 'POST', data, 'application/x-www-form-urlencoded')
			.then(res => {
				if (res.code == 0) {
// 					wx.showToast({
// 						title: '',
// 						icon: 'none',
// 						duration: 2000
// 					})
				} else {
					wx.showToast({
						title: res.error,
						icon: 'none',
						duration: 2000
					})
				}
			})
	},
	switchBoole(value) {
		return value ? 0 : 1
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
