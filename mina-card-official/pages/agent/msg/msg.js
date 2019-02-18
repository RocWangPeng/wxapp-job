//index.js
//获取应用实例
var app = getApp();

Page({
	data: {
		agentData: {},
		ImgHeadPath: '',
		defaultHeadImg: 'http://www.sinelinked.com/static/other/default_head.png',
		consultData: {
			name: '', //姓名
			tel: '', //电话
			c: '', //内容
			address:'',
			tel_token: '', //验证码
		},
		pointerEvent: false,
		sendTxt: '',
		city: '',
		iCode: '', //返回验证码
		team_id: '',
		scenes: '', //二级码参数
		account_id: '',
		xcx_title: '您的贴心保险顾问',
		region: ['请选择'],
		// customItem: '全部',
	},
	imageError: function (e) {
		var that = this
		if (e.target.id == "shareImageUrl") {
			var cMI = 'agentData.shareImageStr'
			this.setData({
				[cMI]: 'http://www.sinelinked.com/static/other/pic-bg3.jpg',
			})
		} else if (e.target.id == "ImgHeadPath") {
			//头像读取失败使用默认头像 
			var cMI = 'agentData.headImg'
			this.setData({
				[cMI]: 'http://www.sinelinked.com/static/other/default_head.png'
			})
		}


	},
	bindRegionChange: function (event) {
		var addressCodeResult = event.detail.code[0]+'|' + event.detail.code[1]
		var cAddress = 'consultData.address'
		this.setData({
			region: event.detail.value,
			[cAddress]:addressCodeResult,
		})
	},
	previewImages: function (e) {
		var that = this;
		console.log(that.data.ImgHeadPath);
		wx.previewImage({
			current: that.data.ImgHeadPath,
			urls: [that.data.ImgHeadPath],
			success: function () {

			}
		})
		wx.hideLoading()
	},
	onLoad: function (options) {
		var that = this
		app.editTabBarAgent()
		// 获取扫码状态下的用户id
		var scenes = decodeURIComponent(options.scene)
		var sceneAccount_id = scenes.split('=')[1]
		if (sceneAccount_id) {
			that.setData({
				scenes: sceneAccount_id
			})
			wx.setStorageSync('account_id', sceneAccount_id)
		}
		// 获取url参数如果没有获取本地储藏
		var account_idzf = options.account_id || wx.getStorageSync('account_id')
		if (account_idzf) {
			that.setData({
				account_id: account_idzf
			})
			wx.setStorageSync('account_id', account_idzf)
		}
	},
	onShow: function () {
		var that = this
		wx.showLoading({
			title: '加载中',
		})
		
		//  scenes存在情景下
		if (that.data.scenes) {
			wx.request({
				url: `https://ii.sinelinked.com/tg_web/api/XCX/agent/search`,
				data: {
					agentId: that.data.scenes
				},
				success: function (res) {
					var ImgHeadPath = 'https://ii.sinelinked.com'+res.data[0].headImg + '?' + Math.random()
					that.setData({
						agentData: res.data[0],
						ImgHeadPath: ImgHeadPath,
					})
					wx.hideLoading()
				}
			})
			// var account_idzf = options.query.account_id || wx.getStorageSync('account_id')
		} else if (that.data.account_id) {
			wx.request({
				url: `https://ii.sinelinked.com/tg_web/api/XCX/agent/search`,
				data: {
					agentId: that.data.account_id
				},
				success: function (res) {
					var ImgHeadPath = 'https://ii.sinelinked.com'+res.data[0].headImg + '?' + Math.random()
					that.setData({
						agentData: res.data[0],
						ImgHeadPath: ImgHeadPath,
					})
					wx.hideLoading()
				}
			})
		}

	},
	//监听内容
	bindKeyInputC: function (e) {
		var cStr = 'consultData.c'
		this.setData({
			[cStr]: e.detail.value
		})

	},
	//监听姓名
	bindKeyInputName: function (e) {

		var namelStr = 'consultData.name'
		this.setData({
			[namelStr]: e.detail.value
		})
	},
	//监听电话
	bindKeyInputTel: function (e) {
		var telStr = 'consultData.tel'
		this.setData({
			[telStr]: e.detail.value
		})
	},
	//监听验证码
	bindKeyInputTel_token: function (e) {
		var tel_token = 'consultData.tel_token'
		this.setData({
			[tel_token]: e.detail.value
		})
	},
	// 提交咨询信息
	agentConsult: function (e) {
		var that = this;
		var uid = e.currentTarget.dataset.id
		wx.request({
			url: `https://ii.sinelinked.com/tg_web/api/order/publishOrders`,
			method:'POST',
			data: {
				name:that.data.consultData.name,
				tel: that.data.consultData.tel,
				address:that.data.consultData.address,
				content:that.data.consultData.c,
				proxyId:uid,
				orign:'2',
				mtype:'1',
				verifyCode:that.data.consultData.tel_token
			},
			success: function (res) {
				if (res.data.code == 0) {
					wx.showModal({
						title: '提示',
						content: '提交成功',
						showCancel: false,
						success: function (res) {
							var namelStr = 'consultData.name'
							var telStr = 'consultData.tel'
							var conStr = 'consultData.c'

							that.setData({
								[namelStr]: '',
								[telStr]: '',
								[conStr]:''
							})
						}
					})
				} else {
					wx.showModal({
						title: '提示',
						content: '请完整填写内容,不可为空',
						showCancel: false,
						success: function (res) {}
					})
				}
			}
		})
	},
	// 发送验证码
	sendPhoneCode(e) {
		var that = this;
		wx.request({
			url: "https://ii.sinelinked.com/tg_web/api/phone/message/send",
			data: {
				phone: that.data.consultData.tel,
				flag: "code_7"
			},
			success: function (res) {
				console.log(res)
				if (res.data.error == 0) {
// 					wx.showToast({
// 						title: '发送成功',
// 						icon: 'success',
// 						duration: 2000
// 					})
					that.setData({
						pointerEvent: true,
						// iCode: res.data.message.iCode
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
					pointerEvent: false
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
	onShareAppMessage: function (res) {
		var that = this;
		// var image = new image()

		// console.log(image)
		return {
			// title: that.data.agentData.data[0].xcx_title || '您的贴心保险顾问',
			title: that.data.agentData.xcxTitle,
			path: `/pages/agent/index/index?account_id=${that.data.agentData.userId}`,
			imageUrl: that.data.agentData.coverTempletUrl + '?' + Math.random(),
			success: function (res) {
				// 转发成功
			},
			fail: function (res) {
				// 转发失败
			}
		}
	}
})
