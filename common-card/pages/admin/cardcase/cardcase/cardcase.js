const app = getApp()
let utils = require('../../../../utils/util.js');
let wechat = require('../../../../utils/wechat.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		current: 'cardcase',
		tabBar: '',
		cardList: '', //名片列表
		searchVal: '', //搜索内容
		showMenu: false,
		visibleRemarks: false,
		visibleAddRemarks: false, //添加标签框
		chooseLabel: [], //选择的标签
		addLabelVal: '', //标签内容
		toggle: false,
		actionsRemarks: [{
				name: '取消'
			},
			{
				name: '确定',
				color: '#ed3f14',
				loading: false
			}
		],
		labelList: [], //所有标签列表
		activeLabelList: [], //当前名片标签
		activeRemark: '', //当前名片备注
		currentTargetId: '', //当前选中名片id
		visibleDel: false,
		visibleAuthModal:false,
		actionsDel: [{
				name: '取消'
			},
			{
				name: '删除',
				color: '#ed3f14',
				loading: false
			}
		],
		words: [],
		cities: [{
				pinyin: 'A',
				name: '贤心'
			},
			{
				pinyin: 'B',
				name: '记忆的时间差'
			}
		],
		citiesData: '',
		hasMsg: false,
		checkedColor: 'blue',
		unionId: '',
		openId: '',
		isScope: 2
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		wx.setNavigationBarTitle({
			title: '名片夹'
		})
		this.getUserInfo()
		this.setData({
			tabBar: app.globalData.tabBar.person
		})
		// 获取本地unionId
		const openId = wx.getStorageSync('currentOpenId')
		const unionId = wx.getStorageSync('currentColectUnionId')
		if(unionId){
			this.setData({
				unionId: unionId,
				openId: openId,
			})
		}else{
			this.setData({
				openId: openId,
			})
			
		}
		
		this.getList()

	},
	searchValHandle(e) {
		this.getList(e)
	},
	// 是否授权
	getUserInfo() {
		wechat.getUserInfo()
			.then(res => {
				this.setData({
					isScope: 1,
				})
			})
			.catch(() => {
				this.setData({
					isScope: 2,
				})
			})
	},
	showAuthTip(){
		this.setData({
			visibleAuthModal: true,
		})
	},
	cancelAuth(){
		this.setData({
			visibleAuthModal: false,
		})
	},
	enterAuth(){
		this.merge()
	},
	// 授权窗口
	onGotUserInfo(res) {
		if (res.detail.errMsg == "getUserInfo:ok") {
			this.setData({
				isScope: 1,
			})
			wechat.getUserInfo()
				.then(res => {
					var params = {
						code: res.code,
						encryptedData: res.encryptedData,
						iv: res.iv,
					}
					wechat.getUnineId(params)
						.then(res => {
							if (res.data.code == 0) {
								var unionId = res.data.data.unionId
								// 临时unionId
								wx.setStorageSync('currentColectUnionId', unionId)
								this.merge()
							}
						})
				})
				.catch(res => {})
		}
	},
	// 根据当前微信用户openid获取unionId
	getUnionIdByOpenId(openId) {
		return new Promise((resolve, reject) => {
			var data = {
				openId: openId,
				role: 1
			}
			utils.request(utils.personApi + '/personal/getUnionIdByOpenId', 'GET', data)
				.then(res => {
					var data = res.data
					if (data.unionId) {
						resolve(data.unionId)
						wx.setStorageSync('currentUnionId', data.unionId)
					} else {
						reject(false)
					}
				})
		})
	},
	// 合并
	merge() {
		var self = this
		var openId = wx.getStorageSync('currentOpenId')
		var unionId = wx.getStorageSync('currentColectUnionId')
		var data = {
			openId: openId,
			unionId: unionId
		}
		utils.request(utils.personApi + '/personal/card/holder/combineCardHolder', 'POST', data,
				'application/x-www-form-urlencoded')
			.then((res) => {
				if (res.code == 0) {
					self.setData({
						visibleAuthModal:false
					})
					wx.showToast({
						title: '已合并',
						icon: 'none',
						duration: 2000
					})
					self.getList()
				} else {
					wx.showToast({
						title: '系统错误,请重试',
						icon: 'none',
						duration: 2000
					})
				}
			})
	},
	// tabBar切换
	handleChange({
		detail
	}) {
		var tabBarData = app.globalData.tabBar.person
		var routeType = getCurrentPages().length >= 9 ? 'redirectTo' : 'navigateTo'
		tabBarData.map((item) => {
			if (detail.key == item.key) {
				wx[routeType]({
					url: item.url
				})
			}
		})
	},
	// 选择项改变时触发
	onChange(event) {
		console.log(event.detail, 'click right menu callback data')
	},
	// 删除名片按钮
	delete(e) {
		this.setData({
			visibleDel: true,
			toggle: false
		})
		var id = e.currentTarget.dataset.id
		this.setData({
			currentTargetId: id
		})
	},
	delHandle({
		detail
	}) {
		if (detail.index === 0) {
			this.setData({
				visibleDel: false
			});
		} else {
			const action = [...this.data.actionsDel];
			action[1].loading = true;
			this.setData({
				actionsDel: action
			});
			var data = {
				// unionId: this.data.unionId,
				openId: this.data.openId,
				contactId: this.data.currentTargetId
			}
			utils.request(utils.personApi + '/personal/card/holder/deleteFromCardHolderByOpenId', 'POST', data,
					'application/x-www-form-urlencoded')
				.then((res) => {
					if (res.code == 0) {
						action[1].loading = false;
						wx.showToast({
							title: '已删除',
							icon: 'none',
							duration: 2000
						})
						this.getList()
						this.setData({
							visibleDel: false,
							actionsDel: action,
							toggle: true
						});
					}
				})
		}
	},
	// 获取名片夹列表
	getList() {
		let data = {
			unionId: this.data.unionId,
			openId: this.data.openId,
		}
		var url = '/personal/card/holder/getListByOpenId'
		if(this.data.unionId){
			url = '/personal/card/holder/getListByUnionId'
		}else{
			url = '/personal/card/holder/getListByOpenId'
		}
		utils.request(utils.personApi + url, 'GET', data)
			.then(res => {
				if (res.code == 0) {

					this.setData({
						cardList: res.data.data.key
					})

					var isEmpty = (JSON.stringify(this.data.cardList) == "{}");
					if (isEmpty) {
						this.setData({
							hasMsg: true,
							showMenu: false,
							citiesData: ''
						})
						return
					}
					this.setData({
						hasMsg: false,
						showMenu: false,
					})
					let cardList = this.data.cardList
					let words = []
					let cities = []

					for (let item in cardList) {
						words.push(item)
						cardList[item].map(val => {
							cities.push({
								id: val.id,
								cardId: val.cardId,
								pinyin: item,
								name: val.cardName,
								cardType: val.cardType,
								remark: val.remark || '',
								cardHeadUrl:val.cardHeadUrl
							})
						})
					}

					this.setData({
						words: words,
						cities: cities
					})

					let storeCity = [];

					let wordData = this.data.words
					let citiesData = this.data.cities

					wordData.forEach((item, index) => {
						storeCity[index] = {
							key: item,
							list: []
						}
					})

					citiesData.forEach((item) => {
						let firstName = item.pinyin;
						let index = wordData.indexOf(firstName);
						storeCity[index].list.push({
							id: item.id,
							cardId: item.cardId,
							name: item.name,
							key: firstName,
							cardType: this.getCardType(item.cardType),
							type: item.cardType,
							remark: item.remark,
							cardHeadUrl:item.cardHeadUrl
						});
						this.setData({
							citiesData: storeCity
						})
					})


				}
			})
	},
	getCardType(val) {
		var val = parseInt(val)
		switch (val) {
			case 1:
				return '个人'
				break;
			case 2:
				return '团队'
				break;
			case 3:
				return '保信个人'
				break;
			case 4:
				return '保信团队'
				break;
			default:
				break;
		}
	},
	// 登录用户获取所有标签列表
	getAllRemark() {
		var data = {
			unionId: this.data.openId,
		}
		utils.request(utils.personApi + '/personal/card/holder/getLabelByUnionId', 'GET', data)
			.then((res) => {
				if (res.code == 0) {
					let labelList = res.data.labelList
					labelList.map(item => {
						item.color = '#fff'
						item.checked = false
					})
					this.setData({
						labelList: labelList
					})
				}
			})
	},
	getLabelAndRemark(id) {
		var data = {
			unionId: this.data.openId,
			contactId: id
		}
		utils.request(utils.personApi + '/personal/card/holder/getLabelAndRemarkByUnionId', 'GET', data)
			.then((res) => {
				if (res.code == 0) {
					let activeLabelList = res.data.labelList
					let remark = res.data.remark
					this.setData({
						activeLabelList: activeLabelList,
						activeRemark: remark
					})

					var labelList = this.data.labelList

					labelList.map(item => {
						activeLabelList.map(subItem => {
							if (item.id == subItem.id) {
								item.color = 'blue'
								item.checked = 'blue'
							}
						})
					})
					var tempLabelId = []
					activeLabelList.map(item => {
						tempLabelId.push(item.id)
					})

					this.setData({
						labelList: labelList,
						chooseLabel: this.data.chooseLabel.concat(tempLabelId)
					})
				}
			})
	},
	// 跳转对应名片
	toCard(e) {
		var cardId = e.currentTarget.dataset.id
		var cardtype = e.currentTarget.dataset.type //卡片类型
		console.log(cardId);
		if (cardId) {
			if (cardtype == 1) {
				wx.navigateTo({
					url: '/pages/card/person/index/index?cardId=' + cardId
				})
			} else if (cardtype == 2) {
				wx.navigateTo({
					url: '/pages/card/team/index/index?cardId=' + cardId
				})
			} else if (cardtype == 3) {
				wx.navigateToMiniProgram({
					appId: 'wx0ff73d8248085825',
					path: '/pages/agent/index/index?userId=' + cardId,
					success(res) {
						// 打开成功
					},
					fail() {

					}
				})
			} else if (cardtype == 4) {
				wx.navigateToMiniProgram({
					appId: 'wx0ff73d8248085825',
					path: '/pages/agent/index/index?teamId=' + cardId,
					success(res) {
						// 打开成功
					},
					fail() {

					}
				})
			}
		}
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
	onPageScroll() {
		// console.log(this.data.showMenu);
		if (this.data.showMenu) {
			this.setData({
				showMenu: false
			})
		}
	},

})
