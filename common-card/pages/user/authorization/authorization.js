let utils = require('../../../utils/util.js');
let wechat = require('../../../utils/wechat.js');
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		wxCode: '',
		role: 1, //1个人 2团队
		openId:'',
		spinShow: true,
		isScope: 1, //1已授权 2未授权
		userLoginData: {}, //登陆数据
		visibilityTeamUser: false,
		teamUser: [],
		title: {
			show: true,
			title: '选择登陆帐号'
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

		// 获取用户类型 
		var role = options.role
		// role 1(个人) 2(团队)
		if (role) {
			this.setData({
				role: role
			})
		}

		// this.getUserInfo()
		var currentOpenId = wx.getStorageSync('currentOpenId') //当前微信用户的unionId
		if (currentOpenId) {
			this.setData({
				openId:currentOpenId
			})
			
			var data = {
				openId: currentOpenId,
				userType: 1,
				role: this.data.role,
				device: 3,
				code: '0',
				// loginPhone: loginPhone || ''
			}
			this.wxLogin(data)
		}

	},
	getChooseCard(e) {
		var index = e.detail.index
		var loginPhone = this.data.teamUser[index].title
		// this.getUserInfo(loginPhone)
		var data = {
			loginPhone: loginPhone || '',
			openId: this.data.openId,
			userType: 1,
			device: 3,
			role: this.data.role,
			code: '0',
		}
		this.wxLogin(data)
	},
	getUserInfo(loginPhone) {
		wechat.getUserInfo()
			.then(res => {
				var data = {
					code: res.code,
					encryptedData: res.encryptedData,
					iv: res.iv,
					userType: 1,
					role: this.data.role,
					device: 3,
					loginPhone: loginPhone || ''
				}
				this.wxLogin(data)
			})
			.catch(res => {
				this.setData({
					isScope: 2,
				})
				this.setData({
					spinShow: false
				})
			})
	},
	// 授权窗口
	onGotUserInfo(res) {
		if (res.detail.errMsg == "getUserInfo:ok") {
			this.setData({
				isScope: 2,
			})
			this.getUserInfo()
		}
	},
	// 微信登陆
	wxLogin(dataObj) {
		var self = this

		if (self.data.role == 1) {
			var _auth = wx.getStorageSync('_auth')
			var loginType_person = wx.getStorageSync('loginType_person')
			if (_auth) {
				console.log('不重新登陆--个人');
				if (loginType_person == 2) {
					wx.redirectTo({
						url: '/pages/user/person/login/login'
					})
				} else {
					var cardCase = wx.getStorageSync('cardCase')
					if(cardCase){
						wx.removeStorage({
						  key: 'cardCase',
						  success(res) {
							console.log(res.data)
						  }
						})
						wx.reLaunch({
							url: '/pages/admin/person/cardcase/cardcase'
						})
					}else{
						wx.reLaunch({
							url: '/pages/admin/person/msg/msg'
						})
					}
					
				}
				return
			}
		}
		wx.request({
			url: utils.authApi + '/auth/user/wx/loginByOpenId',
			data: dataObj,
			success(res) {
				console.log('res');
				if (res.data.code == 0) {
					var data = res.data.data
					if (data.needChoose) {

						var teamUser = data.list.map(item => {
							return {
								title: item.phone,
								id: item.id
							}
						})

						self.setData({
							spinShow: false,
							teamUser: teamUser,
							visibilityTeamUser: true
						})
						return
					}
					// 判断是否需要注册
					if (data.needReg) {
						if (self.data.role == 1) {
							wx.reLaunch({
								url: '/pages/user/person/register/register'
							})
						} else if (self.data.role == 2) {
							wx.reLaunch({
								url: '/pages/user/team/register/register'
							})
						}
					} else {
						if (data.loginType == 'account') {
							if (self.data.role == 1) {
								wx.redirectTo({
									url: '/pages/user/person/login/login'
								})
							} else if (self.data.role == 2) {
								wx.redirectTo({
									url: '/pages/user/team/login/login'
								})
							}

						} else {
							// 自动登陆
							// 登陆成功将cookie信息存储
							var cookie = data.cookie
							var auth = JSON.parse(decodeURIComponent(cookie.value))
							wx.setStorageSync('userUnionId', auth.unionId)
							if (self.data.role == 1) {
								wx.setStorageSync(cookie.name, cookie.value)
								wx.reLaunch({
									url: '/pages/admin/person/msg/msg'
								})
							} else if (self.data.role == 2) {
								wx.setStorageSync(cookie.name + '_team', cookie.value)
								wx.reLaunch({
									url: '/pages/admin/team/member/member'
								})
							}
						}

					}
					// 隐藏spin
					setTimeout(() => {
						self.setData({
							spinShow: false
						})
					}, 300)
				} else if (res.data.code == 22) {
					wx.redirectTo({
						url: '/pages/user/authorization/authorization?role='+self.data.role
					})
				}else{
					wx.showToast({
					  title: res.data.error,
					  icon: 'none',
					  duration: 2000
					})
					
					wx.redirectTo({
						url: '/pages/user/authorization/authorization?role='+self.data.role
					})
				}
			},
			fail:function(err){
				console.log('err');
// 				wx.showToast({
// 				  title: '成功',
// 				  icon: 'success',
// 				  duration: 2000
// 				})

			console.log('服务器出错，重新登陆');
				
				// this.getUserInfo()
				var currentOpenId = wx.getStorageSync('currentOpenId') //当前微信用户的unionId
				if (currentOpenId) {
					this.setData({
						openId:currentOpenId
					})
					
					var data = {
						openId: currentOpenId,
						userType: 1,
						role: this.data.role,
						device: 3,
						code: '0',
						// loginPhone: loginPhone || ''
					}
					this.wxLogin(data)
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
