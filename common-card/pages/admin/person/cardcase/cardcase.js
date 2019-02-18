const app = getApp()
let utils = require('../../../../utils/util.js');
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
		spinShow:true,
		unionId:''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		wx.setNavigationBarTitle({
			title: '名片夹'
		})
		this.setData({
			tabBar: app.globalData.tabBar.person
		})
		this.getList()
		// 登录用户获取所有标签列表
		this.getAllRemark()
	},
	searchValHandle(e){
		this.getList(e)
	},
	// tabBar切换
	handleChange({detail}) {
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
	//显示菜单项
	showMenuHandle() {
		this.setData({
			showMenu: !this.data.showMenu
		})
	},
	// 选择项改变时触发
	onChange(event) {
		console.log(event.detail, 'click right menu callback data')
	},
	// 显示新增备注框
	showAddRemarks() {
		this.setData({
			visibleAddRemarks: true
		})
	},
	// 监听添加标签
	addLabelValHandle(e) {
		this.setData({
			addLabelVal: e.detail.value
		})
	},
	addremarkHandle(e) {
		this.setData({
			activeRemark: e.detail.value
		})
	},
	// 备注确认取消
	remarkAddBtnCancel() {
		this.setData({
			visibleAddRemarks: false,
			showMenu: false
		})
	},
	remarkAddBtnEnter() {
		let labelName = this.data.addLabelVal
		if (labelName) {
			this.addLabel(labelName)
		}
	},
	// 标签按钮
	remark(e) {
		var id = e.currentTarget.dataset.id
		this.setData({
			currentTargetId: id
		})
		
		// 登录用户获取所有标签列表
		this.getAllRemark()
		this.getLabelAndRemark(id)
		
		this.setData({
			visibleRemarks: true,
			toggle: false,
			activeLabelList: [],
			activeRemark: '',
			chooseLabel: []
		})
		
		
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
	delHandle({detail}) {
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
				contactId: this.data.currentTargetId
			}
			utils.request(utils.personApi + '/personal/card/holder/deleteFromCardHolder', 'POST', data,
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
	getList(e) {
		var labelId = ''
		var cardName = ''
		if (e) {
			labelId = e.currentTarget.dataset.labelid || ''
			if(e.detail.detail){
				cardName = e.detail.detail.value || ''
			}
		}

		let data = {
			labelId: labelId,
			cardName: cardName
		}
		utils.request(utils.personApi + '/personal/card/holder/getList', 'GET', data)
			.then(res => {
				console.log(res);
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
						this.setData({spinShow:false})
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
							cardType:this.getCardType(item.cardType),
							type:item.cardType,
							remark: item.remark,
							cardHeadUrl:item.cardHeadUrl
						});
						this.setData({
							citiesData: storeCity
						})
					})
				}
				console.log(res);
				// 隐藏spin
				setTimeout(()=>{
					this.setData({spinShow:false})
				},100)
			})
	},
	// 
	getCardType(val){
		var val = parseInt(val)
		switch (val){
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
		utils.request(utils.personApi + '/personal/card/holder/getLabel', 'GET', )
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
	// 获取指定用户的标签备注
	getLabelAndRemark(id) {
		var data = {
			contactId: id
		}
		utils.request(utils.personApi + '/personal/card/holder/getLabelAndRemark', 'GET', data)
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
	// 检查是否有相同标签
	checkLabelName(labelName) {
		var labelList = this.data.labelList
		return new Promise((resove, reject) => {
			var temp = labelList.map(item => {
				return item.labelName
			})
			if (temp.includes(labelName)) {
				resove(true)
			} else {
				reject(false)
			}
		})
	},
	// 登录用户新增名片夹名片标签
	addLabel(labelName) {
		var data = {
			labelName: labelName
		}

		this.checkLabelName(labelName).then(res => {
			wx.showToast({
				title: '已存在相同标签',
				icon: 'none',
				duration: 2000
			})
		}).catch(res => {
			utils.request(utils.personApi + '/personal/card/holder/addLabel', 'POST', data)
				.then((res) => {
					if (res.code == 0) {
						this.setData({
							visibleRemarks: false,
							visibleAddRemarks: false,
							showMenu: false
						})
						
						// 登录用户获取所有标签列表
						this.getAllRemark()
					} else {
						wx.showToast({
							title: res.error,
							icon: 'none',
							duration: 2000
						})
					}
				})
		})

	},
	// 点击全部标签
	checkableTagHandle(e) {
		var activeIndex = e.detail.name
		var labelList = this.data.labelList
		var activeLabelList = this.data.activeLabelList
		var checked = "labelList[" + activeIndex + "].checked"
		var color = "labelList[" + activeIndex + "].color"
		this.setData({
			[checked]: !this.data.labelList[activeIndex].checked,
		})
		this.setData({
			[color]: this.data.labelList[activeIndex].checked ? 'blue' : '#fff',
		})
		if (labelList[activeIndex].checked) {
			var newArr = [labelList[activeIndex].id]
			this.setData({
				chooseLabel: this.data.chooseLabel.concat(newArr)
			})
		} else {
			var chooseLabelTemp = this.data.chooseLabel
			chooseLabelTemp.map((item, index) => {
				if (item == labelList[activeIndex].id) {
					chooseLabelTemp.splice(index, 1)
				}
			})

			this.setData({
				chooseLabel: chooseLabelTemp
			})

		}
	},
	// 备注确认取消
	remarkBtnCancel() {
		this.setData({
			visibleRemarks: false,
			toggle: true
		})
	},
	remarkBtnEnter() {
		var data = {
			contactId: this.data.currentTargetId,
			labelIds: this.data.chooseLabel,
			remark: this.data.activeRemark
		}
		utils.request(utils.personApi + '/personal/card/holder/addLabelAndRemark', 'POST', data)
			.then((res) => {
				if (res.code == 0) {
					// 登录用户获取所有标签列表
					this.setData({
						visibleRemarks: false,
						toggle: true
					})
					this.getList()
					this.getAllRemark()
				}
			})
	},
	// 更新名片
	refresh(data){
		utils.request(utils.personApi + '/personal/card/holder/refresh', 'POST', data)
			.then((res) => {
				if (res.code == 0) {
				}
			})
	},
	// 跳转对应名片
	toCard(e) {
		var cardId = e.currentTarget.dataset.cardid
		var id = e.currentTarget.dataset.id
		var cardtype = e.currentTarget.dataset.type //卡片类型
		var refreshData = {
			id:id,
			cardId:cardId,
			cardType:cardtype,
		}
		
		this.refresh(refreshData)
		
		if (cardId) {
			if (cardtype == 1) {
				wx.navigateTo({
					url: '/pages/card/person/index/index?cardId=' + cardId
				})
			} else if (cardtype == 2) {
				wx.navigateTo({
					url: '/pages/card/team/index/index?cardId=' + cardId
				})
			}else if (cardtype == 3) {
				wx.navigateToMiniProgram({
					appId: 'wx0ff73d8248085825',
					path: '/pages/agent/index/index?userId=' + cardId,
					success(res) {
						// 打开成功
					},
					fail() {

					}
				})
			}else if (cardtype == 4) {
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
	// 删除标签
	onChangeTagHandle(e){
		var self = this
		wx.showModal({
		  title: '删除标签',
		  content: '是否删除此标签',
		  success(res) {
			if (res.confirm) {
				var data = {
					id:e.target.dataset.id
				}
				utils.request(utils.personApi + '/personal/card/holder/deleteLabel', 'POST', data,'application/x-www-form-urlencoded')
					.then(res=>{
						self.getAllRemark()
						wx.showToast({
							title: '已删除',
							icon: 'none',
							duration: 2000
						})
					})
			} else if (res.cancel) {
				
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
	onPageScroll(){
		// console.log(this.data.showMenu);
		if(this.data.showMenu){
			this.setData({
				showMenu:false
			})
		}
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

})
