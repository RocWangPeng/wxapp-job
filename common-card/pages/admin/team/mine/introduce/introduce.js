let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		teamInfo: '',
		isShow:1,//是否展示
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.cardTeamInfo()
	},
	isShow(){
		var isShow = this.data.isShow == 1?'2':1
		this.setData({isShow:isShow}),
		this.formSubmit()
	},
			// 获取团队名片信息
	cardTeamInfo() {
		utils.requestTeam(utils.teamApi + '/team/get/cardTeamInfo', 'GET')
			.then(res => {
				if (res.code == 0) {
					var teamInfo =  res.data
					if(teamInfo.cardHeadUrl){
						teamInfo.cardHeadUrl = teamInfo.cardHeadUrl + "&"+Math.random()
					}
					
					this.setData({
						cardInfo: teamInfo,
						isShow:teamInfo.cardProfileDisplayStatus
					})
					
				}
				// 隐藏spin
				setTimeout(()=>{
					this.setData({spinShow:false})
				},100)
			})
	},
	bindshowDesc(e) {
		this.setData({
			['teamInfo.cardTeamProfile']: e.detail.value,
		})
	},
	// 提交信息
	formSubmit(e) {
		var data = {
			'teamProfile': this.data.teamInfo.cardTeamProfile,
			'profileStatus': this.data.isShow,
		}

		utils.requestTeam(utils.teamApi + '/team/save/teamprofile', 'POST', data, 'application/x-www-form-urlencoded')
			.then(res => {
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

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
