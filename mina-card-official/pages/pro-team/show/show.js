// pages/show/show.js
//获取应用实例
var app = getApp();

Page({
  data: {
    agentShowData: {},
    imgProTeamPath:[],
    imgProTeamCoverPath:'',
    teamId:'',
    defaultHeadImg: 'http://www.sinelinked.com/static/other/default_head.png',
  },
	imageError: function(e) {
    var that = this;
    if (e.target.id == "shareImageUrl") {
      var cMI = 'agentData.coverTempletUrl'
      this.setData({
        [cMI]: 'http://www.sinelinked.com/static/other/pic-bg3.jpg',
      })
    }else if(e.target.id == "ImgHeadPath"){
			var cMI = 'agentShowData.headImg'
			this.setData({
				[cMI]: 'http://www.sinelinked.com/static/other/default_head.png'
			})
		}
		
		if(e.target.id == "ImgSelfCoverPath"){
			var cMI2 = 'agentShowData.teamShowCover'
			this.setData({
				[cMI2]: 'http://www.sinelinked.com/static/other/show-bg.jpg'
			})
		}
	},

  onLoad: function (options) {
    var that = this;
    app.editTabBarProTeam()
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    if (options.teamId){
      that.setData({
        teamId: options.teamId
      })
    }
  },
  onShow(e){
    var that = this;
    //获取 account_id
    var teamId = wx.getStorageSync('teamId')
    if (teamId) {
      that.setData({
        teamId: teamId
      })
      wx.request({
        url: 'https://ii.sinelinked.com/tg_web/api/XCX/team/search',
        data: {
          teamId: teamId
        },
        success: function (res) {
          that.setData({
            agentShowData: res.data[0],
          })

          // 防止图片缓存begin
          that.setData({
            imgProTeamCoverPath: res.data[0].teamShowCover + '?' + Math.random()
          })
          var newImgSelfPath = []
          for (var i = 0; i < res.data[0].teamImg.length; i++) {
            newImgSelfPath.push(res.data[0].teamImg[i] + '?' + Math.random())
          }
          that.setData({
            imgProTeamPath: newImgSelfPath
          })
          // 防止图片缓存end

          wx.hideLoading()

        }
      })
    } else {
      var teamId = that.data.teamId
      if (teamId){
        wx.request({
          url: 'https://ii.sinelinked.com/tg_web/api/XCX/team/search',
          data: {
            teamId: teamId
          },
          success: function (res) {
            that.setData({
              agentShowData: res.data[0],
            })
            wx.setStorageSync('teamId', teamId)

            // 防止图片缓存begin

            that.setData({
              imgProTeamCoverPath: res.data.teamShowCover + '?' + Math.random()
            })
            var newImgSelfPath = []
            for (var i = 0; i < res.data[0].teamImg.length; i++) {
              newImgSelfPath.push(res.data[0].teamImg[i] + '?' + Math.random())
            }
            that.setData({
              imgProTeamPath: newImgSelfPath
            })
            // 防止图片缓存end

            wx.hideLoading()

          }
        })
      }
     
    }
  },
  previewImages: function (e) {
    var that = this;
    wx.previewImage({
      current: e.currentTarget.dataset.item, 
      urls: that.data.imgProTeamPath
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.agentShowData.teamXcxTitle,
      path: `/pages/pro-team/show/show?teamId=${that.data.agentShowData.userId}`,
      imageUrl: that.data.agentShowData.coverTempletUrl + '?' + Math.random(),
      success: function (res) {
        console.log(res)
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
