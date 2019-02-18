const app = getApp()
let utils = require('../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		current: 'msg',
		tabBar: '',
		unfold: false,
		msgData: [],
		page: 1,
		hasMsg: false, //是否有消息
		toggle: false,
		activeCardId: '', //当前名片id
		counter: {}, //计数器数据
		spinShow: true,
		wxCode: '',
		isScope: 1, //1已授权 2未授权
		noMsgTab:false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		wx.setNavigationBarTitle({
			title: '消息'
		})

		this.setData({
				tabBar: app.globalData.tabBar.person
			}),
		this.getMsg()
		// this.getCardList()
		this.counterHandle()
	},
	// tabBar切换
	handleChange({
		detail
	}) {
		var tabBarData = app.globalData.tabBar.person
		var routeType = getCurrentPages().length >= 9 ? 'reLaunch' : 'navigateTo'
		tabBarData.map((item) => {
			if (detail.key == item.key) {
				wx[routeType]({
					url: item.url
				})
			}
		})
	},
	// 获取名片列表
	getCardList() {
		utils.request(utils.personApi + '/personal/get/card/List', 'GET')
			.then(res => {
				if (res.code == 0) {
					if (JSON.stringify(res.data) == "{}") {
						//还没有名片
// 						this.setData({
// 							hasMsg: true,
// 							spinShow: false
// 						})
						return
					}
					if (res.data.cardList.length == 0) {
						//还没有名片
// 						this.setData({
// 							hasMsg: true
// 						})
					} else {
						this.setData({
							activeCardId: res.data.cardList[0].id,
						})
						try {
							wx.setStorageSync('activeUnionId', res.data.cardList[0].unionId)
						} catch (e) {}
						this.getMsg()
					}

				}
			})
	},
	// 获取计数器数据
	counterHandle() {
		utils.request(utils.personApi + '/counter/get', 'GET')
			.then(res => {
				if (res.code == 0) {
					this.setData({
						counter: res.data.info
					})
				}
			})

	},
	// 顶部数据条展开
	unfoldHandle() {
		this.setData({
			unfold: !this.data.unfold,
		});
	},
	// 获取消息列表
	getMsg(msgSetType = true,msgType=0) {
		let data = {
			readFlag: msgType,
			page: this.data.page
		}
		utils.request(utils.personApi + '/personal/get/message/list', 'GET', data)
			.then(res => {
				if (res.code == 0) {
					
					// 隐藏spin
					this.setData({
						spinShow: false
					})

					res.data.info.items.map(item => {
						item.typeIcon = this.getMsgType(item.msgType).icon
						item.title = this.getMsgType(item.msgType).title
						item.createTime = item.createTime.slice(5)
						item.msgContent = item.msgContent.replace(/\\n/g,"\n")  //数据转json会对\n再次转议
					})

					var msgSetTypeData = ''
					if (msgSetType) {
						msgSetTypeData = this.data.msgData.concat(res.data.info.items)
					} else {
						msgSetTypeData = res.data.info.items
					}

					this.setData({
						msgData: msgSetTypeData
					})

					if (this.data.msgData.length == 0) {
						this.setData({
							hasMsg: true
						})
					}else{
						this.setData({
							hasMsg: false
						})
					}

				}
				this.setData({
					toggle: false
				})
				
			})
	},
	// 获取对应头像
	getMsgType(type) {
		switch (type) {
			case 1:
				return {
					icon: 'http://ii.sinelinked.com/miniProgramAssets/card-msg.png',
					title: '系统消息'
				}
				break;
			case 2:
				return {
					icon: 'http://ii.sinelinked.com/miniProgramAssets/card-person.png',
					title: '个人消息'
				}
				break;
			case 3:
				return {
					icon: 'http://ii.sinelinked.com/miniProgramAssets/card-team.png',
					title: '团队消息'
				}
				break;
			default:
				break;
		}
	},
	// 置顶
	stickHandle(e) {
		var relateId = e.currentTarget.dataset.relateid
		var operate = e.currentTarget.dataset.topstatus == 0 ? 1 : 0 //操作类型：0-取消置顶  1-置顶
		var data = {
			relateId: relateId,
			operate: operate
		}
		utils.request(utils.personApi + '/personal/top/message/operate', 'POST', data)
			.then(res => {
				if (res.code == 0) {
					if (operate == 1) {
						wx.showToast({
							title: '已置顶',
							icon: 'none',
							duration: 2000
						})
					} else {
						wx.showToast({
							title: '已取消置顶',
							icon: 'none',
							duration: 2000
						})

					}
					// 关闭滑动按钮
					this.setData({
							toggle: true
						}),

						this.setData({
							page: 1
						})
					setTimeout(() => {
						this.getMsg(false)
					}, 500)
				}
			})
	},
	//指定单条消息已读、删除操作
	delOrReadHandle(e) {

		var relateId = e.currentTarget.dataset.relateid
		var operate = e.currentTarget.dataset.operate //操作类型：2-已读 3-删除
		var cardId = e.currentTarget.dataset.cardid
		var sourceid = e.currentTarget.dataset.sourceid || cardId
		var msgtype = e.currentTarget.dataset.msgtype

		var data = {
			relateId: relateId,
			operate: operate
		}

		utils.request(utils.personApi + '/personal/message/operate', 'POST', data)
			.then(res => {
				if (res.code == 0) {
					if (operate == 2) {
						if (msgtype == 2) {
							utils.navigateTo({
								url: '/pages/card/person/index/index?cardId=' + sourceid
							})
						} else if (msgtype == 3) {
							utils.navigateTo({
								url: '/pages/card/team/index/index?cardId=' + sourceid
							})
						}

					}

					if (operate == 3) {
						wx.showToast({
							title: '已删除',
							icon: 'none',
							duration: 2000
						})
					}

					// 关闭滑动按钮
					this.setData({
							toggle: true
						}),

						this.setData({
							page: 1
						}),
						setTimeout(() => {
							this.getMsg(false)
						}, 100)

				}
			})
	},
	//指定单条消息已读、删除操作
	blackHandle(e) {

		var msgtype = e.currentTarget.dataset.msgtype
		var sourcename = e.currentTarget.dataset.sourcename
		var sourcephone = e.currentTarget.dataset.sourcephone
		var blackUnionId = e.currentTarget.dataset.sourceunionid

		var data = {
			type: msgtype,
			blackCardName: sourcename,
			blackCardPhone: sourcephone,
			blackUnionId:blackUnionId
			
		}
		utils.request(utils.personApi + '/personal/add/black', 'POST', data)
			.then(res => {
				if (res.code == 0) {
					wx.showToast({
						title: '已屏蔽',
						icon: 'none',
						duration: 2000
					})
					// 关闭滑动按钮
					this.setData({
						toggle: true
					})
				}
			})
	},
	// 清空消息
	clearMsg() {
		var self = this
		wx.showModal({
		  title: '提示',
		  content: '确认清空所有消息',
		  success(res) {
			if (res.confirm) {
				var data = {
					unionId: wx.getStorageSync('activeUnionId'),
				}
				utils.request(utils.personApi + '/personal/clean/message', 'POST', data)
					.then(res => {
						if (res.code == 0) {
							wx.showToast({
								title: '已清空',
								icon: 'none',
								duration: 2000
							})
							
							self.getMsg()
						}
					})
				
			} else if (res.cancel) {
			}
		  }
		})
	},
	// 未读
	getNoMsg(e){
		this.setData({
			page: 1
		})
		if(this.data.noMsgTab){
			this.getMsg(false,0)
			this.setData({
				noMsgTab:false
			})
		}else{
			this.getMsg(false,1)
			this.setData({
				noMsgTab:true
			})
		}
		
	},
	// 全部已读
	readMsg(e){
		var data = {
			unionId: wx.getStorageSync('activeUnionId'),
		}
		utils.request(utils.personApi + '/personal/read/message', 'POST', data)
			.then(res => {
				if (res.code == 0) {
					wx.showToast({
						title: '已全部标为已读',
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
		var page = this.data.page + 1
		this.setData({
			page: page
		})
		this.getMsg(true)
	},

})
