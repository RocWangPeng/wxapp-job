let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		visibleAddCard: false,
		visibleChangeCard: false,
		activeId:'',
		newCardVal: '',
		newCardVal: '',
		cardList: [], //名片列表
		actionsAddCard: [{
				name: '取消'
			},
			{
				name: '添加',
				color: '#ed3f14',
				loading: false
			}
		],
		actionsChangeCard: [{
				name: '取消'
			},
			{
				name: '确定',
				color: '#ed3f14',
				loading: false
			}
		]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

	},
	showAddCard() {
		this.setData({
			visibleAddCard: true
		});
	},
	newCardValHandle({
		detail
	}) {
		this.setData({
			newCardVal: detail.detail.value
		});
	},
	addCardHandle({
		detail
	}) {
		console.log(this.data.newCardVal);
		if (detail.index === 0) {
			this.setData({
				visibleAddCard: false
			});
		} else {
			if (!this.data.newCardVal) {
				wx.showToast({
					title: '请输入名片名称',
					icon: 'none',
					duration: 1500
				})
				return
			} else if (this.data.newCardVal && this.data.newCardVal.length > 8) {
				wx.showToast({
					title: '名片名称最多8个字',
					icon: 'none',
					duration: 1500
				})
				return
			}
			const action = [...this.data.actionsAddCard];
			action[1].loading = true;

			this.setData({
				actionsAddCard: action,
			});
			var cardName = {
				cardName: this.data.newCardVal
			}
			utils.request(utils.personApi + '/personal/add/card/info', 'POST', cardName, 'application/x-www-form-urlencoded')
				.then(res => {
					if (res.code == 0) {
						wx.showToast({
							title: '添加新名片成功',
							icon: 'success',
							duration: 2000
						})
						this.getCardList()
					} else {
						wx.showToast({
							title: '添加新名片失败',
							icon: 'none',
							duration: 2000
						})
					}
					action[1].loading = false;
					this.setData({
						visibleAddCard: false,
						actionsAddCard: action
					});
				})
		}
	},
		changeCardHandle({
		detail
	}) {
		if (detail.index === 0) {
			this.setData({
				visibleAddCard: false
			});
		} else {
			if (!this.data.newCardVal) {
				wx.showToast({
					title: '请输入名片名称',
					icon: 'none',
					duration: 1500
				})
				return
			} else if (this.data.newCardVal && this.data.newCardVal.length > 8) {
				wx.showToast({
					title: '名片名称最多8个字',
					icon: 'none',
					duration: 1500
				})
				return
			}
			const action = [...this.data.actionsChangeCard];
			action[1].loading = true;
	
			this.setData({
				actionsChangeCard: action,
			});
			var data = {
				cardSymbol: this.data.newCardVal,
				id:this.data.activeId
			}
			utils.request(utils.personApi + '/personal/update/card/symbol', 'POST', data, 'application/x-www-form-urlencoded')
				.then(res => {
					if (res.code == 0) {
						wx.showToast({
							title: '修改成功',
							icon: 'success',
							duration: 2000
						})
						this.getCardList()
					} else {
						wx.showToast({
							title: '修改失败',
							icon: 'none',
							duration: 2000
						})
					}
					action[1].loading = false;
					this.setData({
						visibleChangeCard: false,
						actionsChangeCard: action,
						newCardVal:'',
					});
				})
		}
	},
	// 获取名片列表
	getCardList() {
		utils.request(utils.personApi + '/personal/get/card/List', 'GET')
			.then(res => {
				if (res.code == 0) {
					let cardList = res.data.cardList
					cardList.map(item => {
						item.cardHeadUrl = item.cardHeadUrl + '&' + Math.random()
					})
					this.setData({
						cardList: cardList
					})
					wx.setStorageSync('cardId', cardList[0].id)
				}
			})
	},
	// 选择默认名片
	chooseCard(e) {
		var activeId = e.currentTarget.dataset.id
		var activeIndex = e.currentTarget.dataset.index

		var data = {
			cardId: activeId
		}
		wx.setStorageSync('cardId', activeId)

		setTimeout(()=>{
			wx.navigateBack({
				delta: 1
			})
		},500)
	},
	/* 长按 */
	showAction(e) {
		var self = this
		var activeId = e.currentTarget.dataset.id
		this.setData({
			activeId:activeId
		})
		var data = {
			cardId: activeId
		}
	
		wx.getSystemInfo({
			success: function(result) {
				//选项集合
				let itemList;
				if (result.platform == 'android') {
					itemList = ['修改名片名字', '设置为默认名片','删除该名片','取消']
				} else {
					itemList = ['修改名片名字', '设置为默认名片','删除该名片']
				}
				wx.showActionSheet({
					itemList: itemList,
					success: function(res) {
						if (res.tapIndex == 0) {
							
							self.setData({
								visibleChangeCard:true
							})
							
						} else if (res.tapIndex == 1) {
							// 设置为默认名片
							utils.request(utils.personApi + '/personal/setDefaultCard', 'POST', data, "application/x-www-form-urlencoded")
								.then(res => {
									if (res.code == 0) {
										wx.showToast({
										  title: '已设置为默认名片',
										  icon: 'none',
										  duration: 2000
										})
										self.getCardList()
									}
								})
							
						} else if (res.tapIndex == 2) {
							//删除
							self.delCard()
						}
					},
				})
			},
		})
	},

	// 删除名片
	delCard(){
		var self = this
		var data = {
			id:this.data.activeId
		}
		wx.showModal({
		  title: '提示',
		  content: '如该名片有加入团队或者其它关联设置,将自动失效或者解除',
		  success(res) {
			if (res.confirm) {
				utils.request(utils.personApi + '/personal/del/card', 'POST', data, "application/x-www-form-urlencoded")
					.then(res => {
						if (res.code == 0) {
							wx.showToast({
							  title: '已删除',
							  icon: 'none',
							  duration: 2000
							})
							self.getCardList()
						}
					})
			} else if (res.cancel) {
			  console.log('用户点击取消')
			}
		  }
		})

		
	},
	// 长按设置默认名片
	setDefaultCard(e) {
		var self = this
		var activeId = e.currentTarget.dataset.id
		var data = {
			cardId: activeId
		}
		wx.showModal({
			title: '提示',
			content: '是否设置为默认名片',
			success(res) {
				if (res.confirm) {
					utils.request(utils.personApi + '/personal/setDefaultCard', 'POST', data, "application/x-www-form-urlencoded")
						.then(res => {
							if (res.code == 0) {
								wx.showToast({
								  title: '已设置为默认名片',
								  icon: 'none',
								  duration: 2000
								})
								self.getCardList()
							}
						})
				} else if (res.cancel) {}
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
		this.getCardList()
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
