let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		visibleAddCard: false,
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
