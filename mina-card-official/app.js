//app.js

App({

	onLaunch: function (options) {

    console.log('app onlauch')
		// var scene = decodeURIComponent(options.query.scene)
		// var account_id = scene.split('=')[1]
		// var account_idzf = options.query.account_id
		// var localAccount_id = wx.getStorageSync('account_id')

		// if (account_id) {
		// 	wx.setStorageSync('account_id', account_id)
		// } else if (account_idzf) {
		// 	wx.setStorageSync('account_id', account_idzf)
		// } else if (localAccount_id) {
      
    //   wx.redirectTo({
    //     url: '/pages/agent/index/index',
    //     success: function () {
    //       // console.log('home 跳转成功');
    //     },
    //     fail: function () {
    //       // console.log('home 跳转失败');
    //     }
    //   })

		// } else {
      
		// 	wx.redirectTo({
		// 		url: '/pages/home/index/index',
		// 		success: function () {
		// 			// console.log('home 跳转成功');
		// 		},
		// 		fail: function () {
		// 			// console.log('home 跳转失败');
		// 		}
		// 	})
		// }

		// var account_idzf = options.account_id || wx.getStorageSync('account_id')
		// var ids;
		// if (scene == 'underfind') {
		// 	ids = scene
		// } else {
		// 	ids = account_idzf
		// }
		// wx.request({
    //   url: `https://ii.sinelinked.com/tg_web/api/XCX/agent/search`,
		// 	data: {
    //     agentId: ids
		// 	},
		// 	success: function (res) {
    //     // console.log(res)
		// 		wx.setStorageSync('agentName', res.data[0].name)
		// 	}
		// })


	},
  onShow: function (options){
    console.log('app onShow', options, scene)
    var scene = decodeURIComponent(options.query.scene)
    var account_id = scene.split('=')[1]
    var account_idzf = options.query.account_id
    var localAccount_id = wx.getStorageSync('account_id')

    if (account_id) {
      wx.setStorageSync('account_id', account_id)
    } else if (account_idzf) {
      wx.setStorageSync('account_id', account_idzf)
    } else if (localAccount_id) {
      console.log('应该跳到index')
      // wx.reLaunch({
      //   url: '/pages/agent/index/index',
      //   success: function () {
      //     console.log('home 跳转成功');
      //   },
      //   fail: function () {
      //     console.log('home 跳转失败');
      //   }
      // })

    } else {

      // wx.reLaunch({
      //   url: '/pages/home/index/index',
      //   success: function () {
      //     console.log('home 跳转成功');
      //   },
      //   fail: function () {
      //     console.log('home 跳转失败');
      //   }
      // })
    }

    var account_idzf = options.account_id || wx.getStorageSync('account_id')
    var ids;
    if (scene == 'underfind') {
      ids = scene
    } else {
      ids = account_idzf
    }
    wx.request({
      url: `https://ii.sinelinked.com/tg_web/api/XCX/agent/search`,
      data: {
        agentId: ids
      },
      success: function (res) {
        // console.log(res)
        wx.setStorageSync('agentName', res.data[0].name)
      }
    })

  },
	// 以下为顾问与顾问团队的自定义tabbar
	editTabBarAgent: function () {
		var tabbar = this.globalData.tabbarAgent,
			currentPages = getCurrentPages(),
			_this = currentPages[currentPages.length - 1],
			pagePath = _this.__route__;
		(pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
		for (var i in tabbar.list) {
			tabbar.list[i].selected = false;
			(tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
		}
		_this.setData({
			tabbar: tabbar
		});
	},
	editTabBarProTeam: function () {
		var tabbar = this.globalData.tabbarProTeam,
			currentPages = getCurrentPages(),
			_this = currentPages[currentPages.length - 1],
			pagePath = _this.__route__;
		(pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
		for (var i in tabbar.list) {
			tabbar.list[i].selected = false;
			(tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
		}
		_this.setData({
			tabbar: tabbar
		});
	},
	globalAgentData: '',
	globalData: {
		userInfo: null,
		tabbarAgent: {
			color: "#000000",
			selectedColor: "#3d6cc8",
			backgroundColor: "#ffffff",
			borderStyle: "#ececec",
			list: [{
					pagePath: "/pages/agent/index/index",
					text: "名片",
					iconPath: "/img/card.png",
					selectedIconPath: "/img/card-a.png",
					selected: true
				},
				{
					pagePath: "/pages/agent/msg/msg",
					text: "咨询",
					iconPath: "/img/msg.png",
					selectedIconPath: "/img/msg-a.png",
					selected: false
				},
        {
          pagePath: "/pages/agent/product/product",
          text: "产品",
          iconPath: "/img/product.png",
          selectedIconPath: "/img/product-a.png",
          selected: false
        },  {
					pagePath: "/pages/agent/share/share",
					text: "分享",
					iconPath: "/img/share.png",
					selectedIconPath: "/img/share-a.png",
					selected: false
				},
				{
					pagePath: "/pages/agent/show/show",
					text: "我秀",
					iconPath: "/img/show.png",
					selectedIconPath: "/img/show-a.png",
					selected: false
				}
			],
			position: "bottom"
		},
		tabbarProTeam: {
			color: "#000000",
			selectedColor: "#3d6cc8",
			backgroundColor: "#ffffff",
			borderStyle: "#ececec",
			list: [{
					pagePath: "/pages/pro-team/index/index",
					text: "名片",
					iconPath: "/img/card.png",
					selectedIconPath: "/img/card-a.png",
					selected: true
				},
        {
          pagePath: "/pages/pro-team/msg/msg",
          text: "咨询",
          iconPath: "/img/msg.png",
          selectedIconPath: "/img/msg-a.png",
          selected: false
        }, {
					pagePath: "/pages/pro-team/product/product",
					text: "产品",
					iconPath: "/img/product.png",
					selectedIconPath: "/img/product-a.png",
					selected: false
				},
				
				{
					pagePath: "/pages/pro-team/show/show",
					text: "团队秀",
					iconPath: "/img/show.png",
					selectedIconPath: "/img/show-a.png",
					selected: false
				}
			],
			position: "bottom"
		}
	}
})
