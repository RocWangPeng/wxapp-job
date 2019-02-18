var app = getApp()
let utils = require('../../../../utils/util.js');
let wechat = require('../../../../utils/wechat.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		phone: '', //注册电话
		password: '', //注册密码
		repassword: '', //重复密码
		userType: '', //项目类型：1-名片系统、2-保信系统、3-晟联系统
		role: '', //用户角色：1-个体  2-团队
		openId: '', //注册电话
		unionId: '', //注册电话
		nikeName:'',
		headImgUrl:'',
		regType: '', //注册电话
		verifyCode: '', //验证码
		isScope: 2, //1已授权 2未授权
		clickNo:false,
		sendTxt:'发送验证码'
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.getUnineId()
	},
	getUnineId(e) {
		var self = this
		/* 
				1 如果isScope已授权，则获取本地存储中的UnineId
				2 获取到后查询信息
				3 没有获取到本地中的UnineId，则让用户重新授权
			 */
		wechat.getUserInfo()
			.then(res => {
				self.setData({
					isScope: 1
				})
				var params = {
					encryptedData: res.encryptedData,
					iv: res.iv,
					code: res.code,
					type: 1
				}
				wechat.getUnineId(params)
					.then(res => {
						if (res.data.code == 0) {
							self.setData({
								unionId: res.data.data.unionId,
								openId: res.data.data.openId,
								nickName:res.data.data.nickName,
								headImgUrl:res.data.data.headImgUrl
							})
						}
					})
					.catch(err => {
						console.log(err);
					})
			}).catch(err => {
				// 未授权
				self.setData({
					isScope: 2
				})
			})
	},
	// 授权窗口
	onGotUserInfo(res) {
		this.setData({
			userInfo: res.detail
		})

		if (res.detail.errMsg == "getUserInfo:ok") {
			this.setData({
				isScope: 1,
			})
			this.getUnineId()
		}
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
		} else if (formData.password !== formData.repassword) {
			wx.showToast({
				title: '两次密码输入不一致',
				icon: 'none',
				duration: 1000
			})
			return
		} else if (!formData.verifyCode) {
			wx.showToast({
				title: '请输入验证码',
				icon: 'none',
				duration: 1000
			})
			return
		}
		wx.showLoading({
		  title: '加载中',
		  mask:true
		})
		wx.request({
			method: 'POST',
			url: utils.authApi + '/auth/user/register',
			data: {
				phone: formData.phone, //注册电话
				password: formData.password, //注册密码
				userType: 1, //项目类型：1-名片系统、2-保信系统、3-晟联系统
				role: 1, //用户角色：1-个体  2-团队
				openId: this.data.openId, //openId
				unionId: this.data.unionId, //unionId
				verifyCode: this.data.verifyCode, //验证码
				regType:'1' ,////注册方式：1-用户名密码  2-微信自动注册
				nickName: this.data.nickName, //昵称
				headImgUrl: this.data.headImgUrl, //头像
			},
			success(res) {
				wx.hideLoading()
				if (res.data.code == 0) {
					wx.showToast({
						title: '注册成功',
						icon: 'none',
						duration: 1000
					})
					setTimeout(()=>{
						wx.redirectTo({
							url:'/pages/user/authorization/authorization?role=1'
						})
					},1200)
				} else {
					wx.showToast({
						title: res.data.error,
						icon: 'none',
						duration: 1000
					})
				}
			}
		})
	},
	//监听输入框
	phoneHandle(e){
		var value = e.detail.value
		this.setData({phone:value})
	},
	authCodeHandle(e){
		var value = e.detail.value
		this.setData({verifyCode:value})
	},
	// 发送短信验证码
	getVerifyCode() {
		console.log(2);
		if (!utils.regPhone(this.data.phone)) {
			wx.showToast({
				title: '手机号格式不正确',
				icon: 'none',
				duration: 1000
			})
			return
		}
		var data = {
			phone: this.data.phone,
			type: 'CODE1'
		}
		utils.request(utils.authApi + '/auth/phone/send/getVerifyCode', 'get', data)
			.then(res => {
				if (res.code == 0) {
					wx.showToast({
						title: '已发送',
						icon: 'none',
						duration: 2000
					})
					this.countdown()
					
				} else {
					wx.showToast({
						title: res.error,
						icon: 'none',
						duration: 2000
					})
				}
			})
	},
		// 倒计时
	countdown(e) {
		var that = this;
		var timer;
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
