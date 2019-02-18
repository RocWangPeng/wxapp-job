let utils = require('../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		teamDetail: {},
		relationId:'',
		remark:'',
		cardList: [
			// 			{
			// 				title:'贤心',
			// 				id:'2222'
			// 			},
		],
		title: {
			show: true,
			title: '选择加入团队的名片'
		},
		visibilityCardList: false, //个人名片选择弹框
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		console.log(options);
		let cardId = options.cardId
		if (cardId) {
			this.setData({
				cardId: cardId
			})
			this.getMyTeamList(cardId)
		}
	},
	// 查询加入团队的详细信息
	getMyTeamList(cardId) {
		var data = {
			id: cardId
		}
		utils.request(utils.personApi + '/personal/get/cardInfo', 'GET', data)
			.then(res => {
				if (res.code == 0) {
					let teamDetail = res.data.cardInfo
					for (let val in teamDetail) {
						if(teamDetail[val] == null){
							teamDetail[val] = ''
						}
					}
					this.setData({
						teamDetail: teamDetail
					})

				}
			})
	},
	// 审核 删除成员
	teamapply(e) {
		var carPersonalId = e.currentTarget.dataset.carpersonalid
		var data = {
			carPersonalId: carPersonalId,
			status: 3

		}
		utils.requestTeam(utils.teamApi + '/team/review/teamapply', 'POST', data, 'application/x-www-form-urlencoded')
			.then(res => {
				if (res.code == 0) {
					wx.showToast({
						title: '已删除',
						icon: 'none',
						duration: 2000
					})
					this.setData({
						memberModel: false
					})
				} else {
					wx.showToast({
						title: res.error,
						icon: 'none',
						duration: 2000
					})
				}
				// 获取所有已加入的成员
				this.teamlist().then(res => {
					this.setData({
						teamlist: res
					})
				})
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
