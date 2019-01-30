var utils = require('../../utils/util.js')

Component({
	properties: {
		data: Object,
		isCollect: Boolean
	},
	lifetimes: {
		attached() {
			console.log(this.data.isCollect);
		},
	},
	methods: {
		isRegPerByUnion() {
			return new Promise((resolve, reject) => {
				var data = {
					unionId: this.data.data.unionId
				}
				wx.request({
					url: 'https://www.tcrunner.com/UniversalCards/apiPersonal/personal/isRegPerByUnion',
					method: 'GET',
					data: data,
					success: res => {
						resolve(res.data.isReg)
					},
				});

			})
		},
		collection() {
			var self = this
			var data = {
				unionId: this.data.data.unionId, //unionId
				cardId: this.data.data.cardId, //名片id
				cardName: this.data.data.cardName,
				cardHeadUrl: this.data.data.cardHeadUrl,
				cardType: this.data.data.cardType //名片类型 ：1-个体  2-团队  3-商铺
			}
			console.log(this.data.isCollect);
			if (this.data.isCollect) {
				wx.showModal({
					title: '提示',
					content: '确定取消收藏',
					success(res) {
						if (res.confirm) {
							wx.request({
								url: 'https://ii.sinelinked.com/tg_web/api/card/cancel',
								method: 'POST',
								data: data,
								success: res => {
									if (res.data.code == 0) {
										wx.showToast({
											title: '已取消收藏',
											icon: 'none',
											duration: 2000
										})
										self.setData({
											isCollect: false
										})
										// self.counter()
									} else {
										wx.showToast({
											title: res.error,
											icon: 'none',
											duration: 2000
										})
									}
								},
							});

						}
					}
				})

			} else {
				wx.request({
					url: 'https://ii.sinelinked.com/tg_web/api/card/collect',
					method: 'POST',
					data: data,
					success: res => {
						if (res.data.code == 0) {
							wx.showToast({
								title: '已收藏',
								icon: 'none',
								duration: 2000
							})
							self.setData({
								isCollect: true
							})
							// this.counter()
						} else {
							wx.showToast({
								title: res.error,
								icon: 'none',
								duration: 2000
							})
						}
					},
				});
			}


		},
		toCardCase() {
			var data = {
				unionId: this.data.data.unionId
			}
			wx.request({
				url: 'https://www.tcrunner.com/UniversalCards/apiPersonal/personal/isRegPerByUnion',
				method: 'GET',
				data: data,
				success: res => {
					if (res.data.data.isReg) {
						wx.navigateToMiniProgram({
							appId: 'wx3facaaa31f346d16',
							path: '/pages/admin/person/cardcase/cardcase',
							success(res) {
								// 打开成功
							},
							fail() {

							}
						})

					} else {
						wx.navigateToMiniProgram({
							appId: 'wx3facaaa31f346d16',
							path: '/pages/admin/cardcase/cardcase/cardcase',
							success(res) {
								// 打开成功
							},
							fail() {

							}
						})

					}
				},
			});


		},
		// 统计收藏
		counter() {
			var data = {
				cardId: this.data.data.cardId,
				type: 1
			}
			var requestUrl = utils.personApi + '/counter/refresh'
			utils.request(requestUrl, 'POST', data)
		},

	}
});
