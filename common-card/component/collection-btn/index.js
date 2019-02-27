var utils = require('../../utils/util.js')
Component({
	properties: {
		data: Object,
		isCollect: Boolean
	},
	lifetimes: {

	},
	methods: {
		// 根据当前微信用户openid获取unionId
		getUnionIdByOpenId() {
			return new Promise((resolve, reject) => {
				var data = {
					openId: this.data.data.openId,
					role: 1
				}
				utils.request(utils.personApi + '/personal/getUnionIdByOpenId', 'GET', data)
					.then(res => {
						var data = res.data
						
						if (data.unionId) {
							resolve(data.unionId)
						} else {
							reject(false)
						}
					})
			})
		},
		isRegPerByUnion(unionId) {
			return new Promise((resolve, reject) => {
				var data = this.data.data
				if (unionId) {
					var data = {
						unionId: unionId
					}
					utils.request(utils.personApi + '/personal/isRegPerByUnion', 'GET', data)
						.then(res => {
							resolve(res.data.isReg)
						})
				} else {
					reject()
				}

			})
		},
		collection() {
			var self = this
			var data = this.data.data
			if (this.data.isCollect) {
				var data = {
					unionId: data.unionId, //unionId
					openId: data.openId, //unionId
					cardId: data.cardId, //名片id
					cardType: data.cardType //名片类型 ：1-个体  2-团队  3-商铺
				}
				var requestUrl = utils.personApi + '/personal/card/holder/cancel'
				wx.showModal({
					title: '提示',
					content: '确定取消收藏',
					success(res) {
						if (res.confirm) {
							utils.request(requestUrl, 'POST', data)
								.then(res => {
									if (res.code == 0) {
										wx.showToast({
											title: '已取消收藏',
											icon: 'none',
											duration: 2000
										})
										self.setData({
											isCollect: false
										})
										// self.counter(2)
									} else {
										wx.showToast({
											title: res.error,
											icon: 'none',
											duration: 2000
										})
									}
								})
						} else if (res.cancel) {

						}
					}
				})

			} else {
				var data = this.data.data
				this.getUnionIdByOpenId()
					.then(unionId => {
						data.unionId = unionId
						var requestUrl = utils.personApi + '/personal/card/holder/collect'
						utils.request(requestUrl, 'POST', data)
							.then(res => {
								if (res.code == 0) {
									wx.showToast({
										title: '已收藏',
										icon: 'none',
										duration: 2000
									})
									self.setData({
										isCollect: true
									})
									this.counter(2)
								} else {
									wx.showToast({
										title: res.error,
										icon: 'none',
										duration: 2000
									})
								}
							})
					})
					.catch(e=>{
						var requestUrl = utils.personApi + '/personal/card/holder/collect'
						utils.request(requestUrl, 'POST', data)
							.then(res => {
								if (res.code == 0) {
									wx.showToast({
										title: '已收藏',
										icon: 'none',
										duration: 2000
									})
									self.setData({
										isCollect: true
									})
									this.counter(2)
								} else {
									wx.showToast({
										title: res.error,
										icon: 'none',
										duration: 2000
									})
								}
							})
					})


			}


		},
		toCardCase() {
			wx.setStorageSync('cardCase', true)
			var data = this.data.data
			this.getUnionIdByOpenId()
				.then(unionId => {
					this.isRegPerByUnion(unionId)
						.then(res => {
							// 							if (res) {
							// 								wx.navigateTo({
							// 									url: '/pages/admin/cardcase/cardcase/cardcase',
							// 								})
							// 							} else {
							// 								wx.navigateTo({
							// 									url: '/pages/admin/person/cardcase/cardcase'
							// 								})
							// 							}
							if (res) {
								wx.navigateTo({
									url: '/pages/admin/person/cardcase/cardcase'
								})
							} else {
								wx.navigateTo({
									url: '/pages/admin/cardcase/cardcase/cardcase',
								})
							}
						})
				})
				.catch(e => {
					wx.navigateTo({
						url: '/pages/admin/cardcase/cardcase/cardcase',
					})
				})


		},
		// 统计收藏
		counter(type) {
			var data = {
				cardId: this.data.data.cardId,
				type: type
			}
			var requestUrl = utils.personApi + '/counter/refresh'
			utils.request(requestUrl, 'POST', data)
		},
	}
});
