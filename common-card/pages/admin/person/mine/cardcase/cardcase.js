const app = getApp()
let utils = require('../../../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		current: 'cardcase',
		tabBar: '',
		cardList: '', //名片列表
		searchVal: '', //搜索内容
		labelList: [], //所有标签列表
		currentTargetId: '', //当前选中名片id
		showModal: false,
		cities: [{
			pinyin: 'A',
			name: '贤心'
		}, ],
		citiesData: '',
		hasMsg: false,
		checkedColor: 'blue',
		type: 'white',
		infoType: 1
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.setData({
			tabBar: app.globalData.tabBar.person
		})
		var type = options.type
		if (type) {
			this.setData({
				type: type
			})
		}
		this.getList()
	},
	searchValHandle(e) {
		this.getList(e)
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
	// 获取名片夹列表
	getList(e) {
		var labelId = ''
		var cardName = ''
		if (e) {
			labelId = e.currentTarget.dataset.labelid || ''
			if (e.detail.detail) {
				cardName = e.detail.detail.value || ''
			}
		}

		let data = {
			labelId: labelId,
			cardName: cardName
		}
		utils.request(utils.personApi + '/personal/card/holder/getList', 'GET', data)
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
								cardHeadUrl: val.cardHeadUrl
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
							cardHeadUrl: item.cardHeadUrl
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
	// 选择名片
	chooseHandle(e) {
		this.setData({
			showModal: true,
			currentTargetId: e.currentTarget.dataset.cardid,
			infoType: e.currentTarget.dataset.infotype,
		})
	},
	enterHandle(e) {
		const cardId = wx.getStorageSync('cardId')
		if (cardId) {
			if (this.data.type == 'white') {

				// 添加到白名单
				var data = {
					collectCardId: this.data.currentTargetId,
					cardId: cardId,
					cardType: this.data.infoType
				}
				utils.request(utils.personApi + '/personal/add/whiteByCardHolder', 'POST', data,
						'application/x-www-form-urlencoded')
					.then(res => {
						if (res.code == 0) {
							wx.navigateBack({
								delta: 1
							})
						}else if(res.code == 251){
							wx.showToast({
							  title: '添加失败,此名片还未完善信息',
							  icon: 'none',
							  duration: 2000
							})
							setTimeout(()=>{
								wx.navigateBack({
									delta: 1
								})
							},1800)
						}else{
							wx.showToast({
							  title: res.error,
							  icon: 'none',
							  duration: 2000
							})
							setTimeout(()=>{
								wx.navigateBack({
									delta: 1
								})
							},1800)
						}
					})
			} else {
				// 添加到黑名单
				var data = {
					collectCardId: this.data.currentTargetId,
					cardId: cardId,
					cardType: this.data.infoType
				}
				utils.request(utils.personApi + '/personal/add/blackByCardHolder', 'POST', data,
						'application/x-www-form-urlencoded')
					.then(res => {
						if (res.code == 0) {
							wx.navigateBack({
								delta: 1
							})
						}else{
							wx.showToast({
							  title: res.error,
							  icon: 'none',
							  duration: 2000
							})
							setTimeout(()=>{
								wx.navigateBack({
									delta: 1
								})
							},1800)
						}
					})
					
// 				utils.navigateTo({
// 					url: '/pages/admin/person/mine/blacklist/blacklist?cardId=' + cardId + '&origin=1' + '&targetCardId=' + this.data
// 						.currentTargetId
// 				})
			}
		}

	},
	closeHandle() {
		this.setData({
			showModal: false
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
