//app.js
let wechat = require('./utils/wechat.js');
App({

	onLaunch: function(options) {
		
	},
	onShow(options) {
		var self = this
		var scenes = decodeURIComponent(options.scene) // 获取扫码状态下的用户id
		// agent
    var userId = options.query.userId || scenes.split('=')[1]
		// team
    var teamId = options.query.teamId || scenes.split('=')[1]

		// 获取顾问信息
		if(userId){
			try {
				wx.setStorageSync('userId', userId)
				wx.setStorageSync('userType', 'agent')
			} catch (e) { }
			this.getAaentData(userId)
		}else if(teamId){
			try {
				wx.setStorageSync('teamId', teamId)
				wx.setStorageSync('userType', 'team')
			} catch (e) { }
			this.getTeamData(teamId)
		}else{
      	wx.setStorageSync('userType', 'agent')
		}
	},
	// 获取顾问信息
	getAaentData(userId) {
		var self = this
		wx.request({
			url: `https://ii.sinelinked.com/tg_web/api/XCX/agent/search`,
			data: {
				agentId: userId
			},
			success: function(res) {
				if (Object.prototype.toString.call(res.data) === '[object Array]') {
					var result = res.data[0]
					self.globalData.agentData = result
					// 由于 getAaentData 是网络请求，可能会在 Page.onLoad 之后才返回
					  // 所以此处加入 callback 以防止这种情况
					  if (self.callBack) {
						self.callBack(result)
					  }
				}
			}
		})
	},
	  //获取信息
		getTeamData(teamId) {
			var self = this;
			wx.request({
				url: `https://ii.sinelinked.com/tg_web/api/XCX/team/search`,
				data: {
					teamId: teamId
				},
				success: function (res) {
					if (Object.prototype.toString.call(res.data) === '[object Array]') {
						var result = res.data[0]
						try {
							wx.setStorageSync('teamData', result)
						} catch (e) { }
					}

					wx.redirectTo({
						url: '/pages/team/index/index?teamId='+teamId
					})
				}
			})
		},
	globalData: {
		userInfo: null,
		isScope: null,
		agentData:null
	}
})
