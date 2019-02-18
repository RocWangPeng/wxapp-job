let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		msgData: [],
		page:1
	},


	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.getMsg()
	},
	getMsg() {
		var data = {
			page:this.data.page,
			rows:10
		}
		utils.requestTeam(utils.teamApi + '/team/find/historymessgae', 'POST', data, 'application/x-www-form-urlencoded')
			.then(res => {
				if (res.code == 0) {
					this.setData({
						msgData: this.data.msgData.concat(res.data.info.items),
						
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
	onReachBottom: function() {
		var page = this.data.page + 1
		this.setData({
			page: page
		})
		this.getMsg()
	},
})
