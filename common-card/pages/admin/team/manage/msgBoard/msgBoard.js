let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		leaveword: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.leaveword()
	},
	bindinput(e) {
		console.log(ez);
	},
	// 根据团队ID查询团队的留言
	leaveword() {

		var data = {
			role: 2, // 留言者角色：1-游客 2-团队用户
		}
		utils.requestTeam(utils.teamApi + '/team/find/leavewordsys', 'GET', data, 'application/x-www-form-urlencoded')
			.then(res => {
				if (res.code == 0) {
					var leaveword = res.data
					this.setData({
						leaveword: leaveword
					})
				} else {

				}
			})
	},
	/* 团队管理者删除留言 */
	delleaveword(e) {
		var self = this
		var id = e.currentTarget.dataset.id
		var data = {
			id: id,
		}
		
		wx.showModal({
		  title: '提示',
		  content: '确认删除此条信息',
		  success(res) {
			if (res.confirm) {
				utils.requestTeam(utils.teamApi + '/team/del/leaveword', 'POST', data, 'application/x-www-form-urlencoded')
					.then(res => {
						if (res.code == 0) {
							self.leaveword()
						}
					})
			} else if (res.cancel) {
			  console.log('用户点击取消')
			}
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
