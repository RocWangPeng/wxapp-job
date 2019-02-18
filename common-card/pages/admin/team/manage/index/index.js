const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		current: 'manage',
		tabBar: '',
		spinShow: true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.setData({
			tabBar: app.globalData.tabBar.team
		})
		// 隐藏spin
		setTimeout(() => {
			this.setData({
				spinShow: false
			})
		}, 200)
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
