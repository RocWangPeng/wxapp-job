var utils = require('../../../../utils/util.js')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		question: '', //咨询问题
		userName: '', //用户姓名
		tel: '', //联系方式
		tel_token: '', //验证码,,
		uid: '', //顾问Id
		sendTxt: '发送验证码',
		clickNo: false, //发送验证码按钮是否可点击
	},
	//咨询问题
	bindQuestion: function(e) {
		this.setData({
			question: e.detail.value
		})
	},
	//用户姓名
	bindUserName: function(e) {
		this.setData({
			userName: e.detail.value
		})
	},
	//联系方式
	bindTel: function(e) {
		this.setData({
			tel: e.detail.value
		})
	},
	//验证码
	bindAuthCode: function(e) {
		this.setData({
			tel_token: e.detail.value
		})
	},
	// 提交咨询信息
	submitMsg() {
		var that = this
		if (!that.data.question) {
			wx.showModal({
				title: '提示',
				content: '请填写留言内容',
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
		
		var phoneReg = /^0?(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
		if (!phoneReg.test(that.data.tel)) {
			wx.showModal({
				title: '提示',
				content: '手机号格式不正确',
				showCancel: false
			})
			return
		}

		const currentOpenId = wx.getStorageSync('currentOpenId')
		const currentUnionId = wx.getStorageSync('currentUnionId')
		const activeCardId = wx.getStorageSync('activeCardId')

		var data = {
			role:1,// 留言者角色：1-游客 2-团队用户
			content:that.data.question,
			name:that.data.userName,
			mobile:that.data.tel,
			openId:currentOpenId,
			teamId:activeCardId,
			unionid:currentUnionId
		}
    utils.requestTeam(utils.teamApi + '/team/save/leaveword', 'POST', data, 'application/x-www-form-urlencoded')
			.then(res => {
				if (res.code == 0) {
					wx.showModal({
						title: '提示',
						content: '提交成功',
						showCancel: false,
						success: function(res) {
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
						content: res.error,
						showCancel: false,
					})
				}
			})
			

	},
	onChange: function() {},
	// 发送验证码
	sendAuthCode: function() {
		var that = this;
		wx.request({
			url: "https://ii.sinelinked.com/tg_web/api/phone/message/send",
			data: {
				phone: that.data.tel,
				flag: "code_7"
			},
			success: function(res) {
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
	countdown: function(e) {
		var that = this;
		var timer;
		console.log(e)
		var countdownNum = 120

		function settime() {
			if (countdownNum <= 0) {
				that.setData({
					sendTxt: '发送验证码'
				})
				clearInterval(timer)
				countdownNum = 120;
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

		timer = setInterval(function() {
			settime()
		}, 1000)
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var agentId = wx.getStorageSync('agentId')
		this.setData({
			uid: agentId
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
