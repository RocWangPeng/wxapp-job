var app = getApp()
let utils = require('../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

	},

	formSubmit(e) {
		var formData = e.detail.value
		if (!utils.regPhone(formData.phone)) {
			wx.showToast({
				title: '手机号格式不正确',
				icon: 'none',
				duration: 1000
			})
			return
		} else if (!formData.password) {
			wx.showToast({
				title: '请输入密码',
				icon: 'none',
				duration: 1000
			})
			return
		}

		var data = {
			phone: formData.phone, //电话
			password: formData.password, //密码
			userType: 1, //项目类型：1-名片系统、2-保信系统、3-晟联系统
			loginType: '2',
			role: 1, //用户角色：1-个体  2-团队
		}
		wx.showLoading({
			title: '加载中',
			mask: true
		})
		utils.request(utils.authApi + '/auth/user/login', 'GET', data).then((res) => {
			if (res.code == 0) {
				
				// 登陆成功将cookie信息存储
				var cookie = res.data.cookie
				var auth = JSON.parse(decodeURIComponent(cookie.value))
				wx.setStorageSync('userUnionId', auth.unionId)
				wx.setStorageSync(cookie.name, cookie.value)
				wx.showToast({
					title: '登录成功',
					icon: 'none',
					duration: 1000
				})
				wx.reLaunch({
					url: '/pages/admin/person/msg/msg'
				})
			} else {
				wx.showToast({
					title: res.error,
					icon: 'none',
					duration: 1000
				})
			}

		})
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
