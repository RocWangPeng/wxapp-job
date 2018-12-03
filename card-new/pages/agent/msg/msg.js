// pages/agent/msg/msg.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		question: '', //咨询问题
		userName: '', //用户姓名
		tel: '', //联系方式
		address: '',
		region: ['请选择所属地区'],
		tel_token: '', //验证码,,
		uid: '', //顾问Id
		sendTxt: '发送验证码',
		clickNo: false, //发送验证码按钮是否可点击
	},
	//咨询问题
	bindQuestion: function (e) {
		this.setData({
			question: e.detail.value
		})
	},
	//用户姓名
	bindUserName: function (e) {
		this.setData({
			userName: e.detail.value
		})
	},
	//联系方式
	bindTel: function (e) {
		this.setData({
			tel: e.detail.value
		})
	},
	//验证码
	bindAuthCode: function (e) {
		this.setData({
			tel_token: e.detail.value
		})
	},
	// 所属地区
	bindRegionChange: function (event) {
		var addressCodeResult = event.detail.code[0] + '|' + event.detail.code[1]
		this.setData({
			region: event.detail.value,
			address: addressCodeResult,
		})
	},
	// 提交咨询信息
	submitMsg() {
		var that = this
		if (!that.data.question) {
			wx.showModal({
				title: '提示',
				content: '请填写咨询问题',
				showCancel: false,
			})
			return
		} else if (!that.data.userName) {
			wx.showModal({
				title: '提示',
				content: '请填写用户姓名',
				showCancel: false,
			})
			return
		} else if (!that.data.tel) {
			wx.showModal({
				title: '提示',
				content: '请填写联系方式',
				showCancel: false,
			})
			return
		}

		var phoneReg = /^1(3|4|5|7|8)[0-9]\d{8}$/;
		if (!phoneReg.test(that.data.tel)) {
			wx.showModal({
				title: '提示',
				content: '手机号格式不正确',
				showCancel: false
			})
			return
		}

		wx.request({
			url: `https://ii.sinelinked.com/tg_web/api/order/publishOrders`,
			method: 'POST',
			data: {
				name: that.data.userName,
				tel: that.data.tel,
				address: that.data.address,
				content: that.data.question,
				proxyId: that.data.uid,
				orign: '2',
				mtype: '1',
				verifyCode: that.data.tel_token
			},
			success: function (res) {
				if (res.data.code == 0) {
					wx.showModal({
						title: '提示',
						content: '提交成功',
						showCancel: false,
						success: function (res) {
							that.setData({
								question: '',
								userName: '',
								tel: '',
								tel_token: ''
							})
						}
					})
				} else {
					wx.showModal({
						title: '提示',
						content: res.data.error,
						showCancel: false,
					})
				}
			},
			fail: function (err) {
				console.log(err)
			}
		})
	},
	onChange: function () {},
	// 发送验证码
	sendAuthCode: function () {
		var that = this;
		wx.request({
			url: "https://ii.sinelinked.com/tg_web/api/phone/message/send",
			data: {
				phone: that.data.tel,
				flag: "code_7"
			},
			success: function (res) {
				console.log(res)
				if (res.data.error == 0) {
					wx.showToast({
						title: '发送成功',
						icon: 'success',
						duration: 2000
					})
					that.setData({
						clickNo: true,
					})

					that.countdown()

				} else {
					wx.showToast({
						title: '发送失败',
						icon: 'none',
						duration: 2000
					})
				}
			}
		})
	},
	// 倒计时
	countdown: function (e) {
		var that = this;
		var timer;
		console.log(e)
		var countdownNum = 10

		function settime() {
			if (countdownNum <= 0) {
				that.setData({
					sendTxt: '发送验证码'
				})
				clearInterval(timer)
				countdownNum = 90;
				that.setData({
					clickNo: false
				})
				return;
			} else {
				that.setData({
					sendTxt: '重新发送' + countdownNum
				})
				countdownNum--;
			}
		}

		timer = setInterval(function () {
			settime()
		}, 1000)
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var agentId = wx.getStorageSync('agentId')
		this.setData({
			uid: agentId
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {
		return {
			title: this.data.agentData.xcxTitle || '您的贴心保险顾问',
			path: '/pages/agent/msg/msg?userId=' + this.data.agentData.userId,
		}
	}
})
