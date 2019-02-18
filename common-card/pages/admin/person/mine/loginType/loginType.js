let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		current: '自动登陆',
		newPassword: '',
		renewPassword: '',
		verifyCode: '',
		phone:'',
		loginType:1, //登录方式： ''1''-微信自动登录 ''2''-账号密码
		showUpdatePassword:false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var userId = options.userId
		this.logintype(userId)
	},
	// 修改登陆方式
	loginTypeChange({detail}) {
		var type = detail.value ==  '自动登陆'?1:2
		var data = {
			loginType:type,
			role:1
			
		}
		utils.request(utils.personApi + '/personal/modifyLoginType', 'POST',data,'application/x-www-form-urlencoded	')
			.then(res=>{
				if(res.code == 0){
					this.setData({
						current: type == 1 ?'自动登陆':'密码登陆'
					});
					wx.setStorageSync('loginType_person',type)
				}
			})
		
	},
	showUpdatePassword(){
		this.setData({
			showUpdatePassword:!this.data.showUpdatePassword
		})
	},
	// 获取个人用户登录方式
	logintype(userId){
		utils.request(utils.personApi + '/personal/get/user/logintype', 'GET')
			.then(res=>{
				if(res.code == 0){
					var type = res.data.loginType == 1 ?'自动登陆':'密码登陆'
					this.setData({current:type})
				}
			})
	},
	// 监听输入框
	newPasswordHandle(e){
		var value = e.detail.value
		this.setData({newPassword:value})
	},
	renewPasswordHandle(e){
		var value = e.detail.value
		this.setData({renewPassword:value})
	},
	phoneHandle(e){
		var value = e.detail.value
		this.setData({phone:value})
	},
	authCodeHandle(e){
		var value = e.detail.value
		this.setData({verifyCode:value})
	},
	// 修改密码
	handleClick(){
		var newPassword = this.data.newPassword
		var renewPassword = this.data.renewPassword
		var phone = this.data.phone
		var verifyCode = this.data.verifyCode
		if(!newPassword){
			wx.showToast({
				title: '请输入新密码',
				icon: 'none',
				duration: 2000
			})
			return
		}else if(newPassword !== renewPassword){
			wx.showToast({
				title: '两次密码输入不一致',
				icon: 'none',
				duration: 2000
			})
		}else if(!phone){
			wx.showToast({
				title: '请输入手机号',
				icon: 'none',
				duration: 2000
			})
			return
		}else if(!verifyCode){
			wx.showToast({
				title: '请输入验证码',
				icon: 'none',
				duration: 2000
			})
			return
		}
		var data = {
			password:this.data.newPassword,
			verifyCode:this.data.verifyCode,
			role:1
		}
		utils.request(utils.personApi + '/personal/update/pwd', 'POST',data,'application/x-www-form-urlencoded')
			.then(res=>{
				if(res.code == 0){
					wx.showToast({
						title: '修改成功',
						icon: 'none',
						duration: 2000
					})
				}else{
					wx.showToast({
						title: res.error,
						icon: 'none',
						duration: 2000
					})
				}
			})
	},
	// 发送短信验证码
	getVerifyCode(){
		var newPassword = this.data.newPassword
		var renewPassword = this.data.renewPassword
		var verifyCode = this.data.verifyCode
		if(!newPassword){
			wx.showToast({
				title: '请输入新密码',
				icon: 'none',
				duration: 2000
			})
			return
		}else if(newPassword !== renewPassword){
			wx.showToast({
				title: '两次密码输入不一致',
				icon: 'none',
				duration: 2000
			})
			return
		}
		
		var data = {
			phone:this.data.phone,
			type:'CODE5'
		}
		utils.request(utils.authApi + '/auth/phone/send/getVerifyCode', 'get',data)
			.then(res=>{
				if(res.code == 0){
					wx.showToast({
						title: '已发送',
						icon: 'none',
						duration: 2000
					})
				}else if(res.code == 9){
					wx.showToast({
						title: '获取验证码频率过快',
						icon: 'none',
						duration: 2000
					})
				}else{
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

})
