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
		
		let relationId = options.relationId
		if (relationId) {
			this.setData({
				relationId: relationId
			})
			this.getMyTeamList(relationId)
		}
	},
	// 查询加入团队的详细信息
	getMyTeamList(relationId) {
		var data = {
			relationId: relationId
		}
		utils.request(utils.personApi + '/personal/getMyTeamDetail', 'GET', data)
			.then(res => {
				if (res.code == 0) {
					let teamDetail = res.data.teamDetail
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
	// 输入备注
	remarkHandle(e){
		this.setData({
			['teamDetail.remark']:e.detail.detail.value
		})
	},
	// 修改个人-团队备注
	updatePersonToTeamRemark() {
		var data = {
			relationId : this.data.relationId,
			remark:this.data.teamDetail.remark
		}
		utils.request(utils.personApi + '/personal/updatePersonToTeamRemark', 'POST', data,'application/x-www-form-urlencoded')
			.then(res => {
				
			})
	},
	// 退出团队
	quitTeam() {
		var data = {
			relationId: this.data.teamDetail.relationId
		}
		utils.request(utils.personApi + '/personal/quitTeam', 'POST', data,'application/x-www-form-urlencoded')
			.then(res => {
				if (res.code == 0) {
					wx.showToast({
						title: '已退出',
						icon: 'none',
						duration: 2000
					})
					setTimeout(() => {
						wx.navigateBack({
							delta: 1
						})
					}, 1500)
				}
			})
	},
		// 获取名片列表
	getCardList() {
		wx.showLoading({
			title: '加载中',
		})
		utils.request(utils.personApi + '/personal/get/card/List', 'GET')
			.then(res => {
				wx.hideLoading()
				if (res.code == 0) {
					var userCardList = res.data.cardList
					var cardList = userCardList.map(item => {
						return {
							title: item.cardName,
							id: item.id
						}
					})
					this.setData({
							cardList: cardList
						}),
						this.setData({
							visibilityCardList: true
						})
				}
			})
	},
	// 获取当前所选名片
	getChooseCard(e) {
		var data = {
			cardId: this.data.cardList[e.detail.index].id,
			relationId:this.data.relationId,
		}
		this.updatePersonToTeamCard(data)
	},
	// 修改加入团队的名片
	updatePersonToTeamCard(data){
		utils.request(utils.personApi + '/personal/updatePersonToTeamCard', 'POST',data,'application/x-www-form-urlencoded	')
			.then(res=>{
				if(res.code == 0){
					this.getMyTeamList(this.data.relationId)
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

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
