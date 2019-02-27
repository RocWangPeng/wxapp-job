var utils = require('../../../../utils/util.js')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		content: '',
		leaveword:[],//所有留言数据
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.leaveword()
	},
	bindinput(e) {
		this.setData({
			content: e.detail.value
		})
	},
	// 提交咨询信息
	submitMsg() {
		var that = this
		if (!that.data.content) {
			wx.showModal({
				title: '提示',
				content: '请填写留言内容',
				showCancel: false,
			})
			return
		}

		const currentOpenId = wx.getStorageSync('currentOpenId')
		const currentUnionId = wx.getStorageSync('currentUnionId')
		const activeCardId = wx.getStorageSync('activeCardId')

		var data = {
			role: 2, // 留言者角色：1-游客 2-团队用户
			content: that.data.content,
			openId: currentOpenId,
			teamId: activeCardId,
			unionId: currentUnionId
		}
		utils.requestTeam(utils.teamApi + '/team/save/leaveword', 'POST', data, 'application/x-www-form-urlencoded')
			.then(res => {
				if (res.code == 0) {
					this.leaveword()
					wx.showModal({
						title: '提示',
						content: '提交成功',
						showCancel: false,
						success: function(res) {
							that.setData({
								content: '',
							})
						}
					})
				} else {
					wx.showModal({
						title: '提示',
						content: res.error,
						showCancel: false,
					})
				}
			})
	},
	// 根据团队ID查询团队的留言
	leaveword(){
		const currentOpenId = wx.getStorageSync('currentOpenId')
		const activeCardId = wx.getStorageSync('activeCardId')
		
		var data = {
			role: 2, // 留言者角色：1-游客 2-团队用户
			openId: currentOpenId,
			teamId: activeCardId,
		}
		utils.requestTeam(utils.teamApi + '/team/find/leaveword', 'POST', data, 'application/x-www-form-urlencoded')
			.then(res => {
				if (res.code == 0) {
					var leaveword = res.data.reverse()
					this.setData({
						leaveword:leaveword
					})
				} else {
					
				}
				this.pageScrollToBottom()
			})
	},
	// 获取容器高度，使页面滚动到容器底部
	 pageScrollToBottom: function () {
	   wx.createSelectorQuery().select('.msgList').boundingClientRect(function (rect) {
		 // 使页面滚动到底部
		 wx.pageScrollTo({
		   scrollTop: rect.bottom
		 })
	   }).exec()
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
