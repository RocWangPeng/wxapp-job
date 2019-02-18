let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		cardId: '', //名片id
		cardSystemSearchStatus: true, //名片：是否允许名片被系统搜索: 0-允许 1-不允许
		cardDisplayTeamsStatus: true, //名片：展示自己的团队标识：0-展示  1-不展示
		cardOthersDetailsStatus: true, //名片：是否允许非本团队成员查看详情：0-允许 1-不允许
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.cardTeamInfo()
	},
	onChange(event) {
		const detail = event.detail;
		const status = detail.value ? 0 : 1
		var name = event.currentTarget.dataset.name
		this.setData({
			[name]: detail.value
		})
		
		switch (name) {
			case 'cardSystemSearchStatus':
				this.formSubmit({flag:1,status:status})
				break;
			case 'cardDisplayTeamsStatus':
				this.formSubmit({flag:2,status:status})
				break;
			case 'cardOthersDetailsStatus':
				this.formSubmit({flag:3,status:status})
				break;

			default:
				break;
		}
		
		
	},
			// 获取团队名片信息
	cardTeamInfo() {
		utils.requestTeam(utils.teamApi + '/team/get/cardTeamInfo', 'GET')
			.then(res => {
				if (res.code == 0) {
					var teamInfo =  res.data
					
					 let {
						cardSystemSearchStatus,
						cardDisplayTeamsStatus,
						cardOthersDetailsStatus,
					} = teamInfo
					this.setData({
						cardSystemSearchStatus: cardSystemSearchStatus == 0 ? true : false,
						cardDisplayTeamsStatus: cardDisplayTeamsStatus == 0 ? true : false,
						cardOthersDetailsStatus: cardOthersDetailsStatus == 0 ? true : false,
					})
					
				}
				// 隐藏spin
				setTimeout(()=>{
					this.setData({spinShow:false})
				},100)
			})
	},
	formSubmit(data) {

		utils.requestTeam(utils.teamApi + '/team/update/teamconfig', 'POST', data, 'application/x-www-form-urlencoded')
			.then(res => {
				if (res.code == 0) {
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

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
