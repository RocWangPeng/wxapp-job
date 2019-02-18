const app = getApp()
let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		current: 'mine',
		tabBar: '',
		cardInfo:{},//团队信息
		spinShow:true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.setData({
			tabBar: app.globalData.tabBar.team
		})
	},
	// tabBar切换
	handleChange({
		detail
	}) {
		var tabBarData = app.globalData.tabBar.team
		var routeType = getCurrentPages().length >= 9 ? 'reLaunch' : 'navigateTo'
		tabBarData.map((item) => {
			if (detail.key == item.key) {
				wx[routeType]({
					url: item.url
				})
			}
		})
	},
	// 获取团队名片信息
	cardTeamInfo() {
		utils.requestTeam(utils.teamApi + '/team/get/cardTeamInfo', 'GET')
			.then(res => {
				if (res.code == 0) {
					var teamInfo =  res.data
					if(teamInfo.cardHeadUrl){
						teamInfo.cardHeadUrl = teamInfo.cardHeadUrl + "&"+Math.random()
						teamInfo.cardForwardCoverUrl = teamInfo.cardForwardCoverUrl + "&"+Math.random()
					}
					
					this.setData({
						cardInfo: teamInfo,
					})
					
					try {
					  wx.setStorageSync('teamInfo', teamInfo)
					} catch (e) { 
						console.log(e);
					}
				}else{
					wx.showToast({
					  title: res.error,
					  icon: 'none',
					  duration: 2000
					})
				}
				// 隐藏spin
				setTimeout(()=>{
					this.setData({spinShow:false})
				},100)
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
		this.cardTeamInfo()
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
