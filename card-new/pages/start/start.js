Page({
	data: {
		inputShowed: false,
		inputVal: "",
		agentList: [], //顾问数据
	},
	showInput: function () {
		this.setData({
			inputShowed: true,
		});
	},
	hideInput: function () {
		this.setData({
			inputVal: "",
			inputShowed: false
		});
	},
	clearInput: function () {
		this.setData({
			inputVal: ""
		});
	},
	toIndex(e){
		var userId = e.currentTarget.dataset.userid
		console.log(e,userId);
		wx.reLaunch({
			url:'/pages/index/index?userId='+userId
		})
	},
	inputTyping: function (e) {
		this.setData({
			inputShowed: true,
			inputVal: e.detail.value
		});

		wx.request({
			url: 'https://ii.sinelinked.com/tg_web/api/agent/searchByNameOrTel',
			method: 'GET',
			data: {
				nameOrTel: e.detail.value
			},
			success: res => {
				if (res.data.code == 0 && res.data.data.length) {
					this.setData({
						agentList: res.data.data
					});
				}
			},
		});


	},
	onLoad(){
		wx.hideLoading()
	}
});
