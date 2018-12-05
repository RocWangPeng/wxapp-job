const { $Toast  } = require('../../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    memList:[],
    inputValue:'',
    teamId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      console.log(options);
      if(options.teamId){
        this.setData({
          teamId: options.teamId
        })
      }else{
        try {
          var teamData = wx.getStorageSync('teamData')
          console.log(teamData);
          if (teamData) {
            
            // Do something with return value
            that.setData({teamId:teamData.userId})
          }
        } catch (e) {
          console.log(e);
          // Do something when catch error
        }
      }
			
			
    	wx.request({
    		url: 'https://ii.sinelinked.com/tg_web/api/user/XCX/getTeamAgent',
    		data: {
    			teamId: this.data.teamId
    		},
    		success: function (res) {
          console.log(res);
    			if (res.data.code == 0) {
    				that.setData({
    					memList: res.data.data.memList
            })
            console.log(res.data.data.memList)
    			}
    		}
    	})
  },
	bindKeyInput: function(e) {
		var that = this
		if(e.detail.value == ''){
			wx.request({
				url: 'https://ii.sinelinked.com/tg_web/api/user/XCX/getTeamAgent',
				data: {
					teamId: this.data.teamId
				},
				success: function (res) {
					if (res.data.code == 0) {
						that.setData({
							memList: res.data.data.memList
						})
					}
				}
			})
		}
		
    this.setData({
      inputValue: e.detail.value
    })
		
  },
	searchByNameOrTel(){
    var that = this
    if(!this.data.inputValue){
      $Toast({
        content: '请输入搜索内容',
        type: 'warning'
    });
    
      return
    }
		wx.request({
			url: 'https://ii.sinelinked.com/tg_web/api/agent/searchByNameOrTel',
			data: {
				nameOrTel: this.data.inputValue
			},
			success: function (res) {
				if (res.data.code == 0) {
					that.setData({
						memList: res.data.data
					})
				}
			}
		})
	},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
			title: this.data.agentData.xcxTitle || '您的贴心保险顾问',
			path: '/pages/team/memberList/memberList?teamId=' + this.data.agentData.userId,
		}
  }
})