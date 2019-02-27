import router from './utils/router.js'
import wechat from './utils/wechat.js'
App({
	router,
	onLaunch: function(options) {
		var currentOpenId = wx.getStorageSync('currentOpenId') //当前微信用户的openId
		if (!currentOpenId) {
			// 存储当前小程序用户openId || unionId
			wechat.getOpenIdOrUnionId()
				.then(res => {
					var data = res
					// 存储当前小程序用户openId || unionId
					wx.setStorageSync('currentOpenId', data.openId)
					wechat.getUnionIdByOpenId(data.openId)
						.then(res=>{
							console.log(res);
							wx.setStorageSync('currentUnionId', res.data.data.unionId)
						})
					
				})
				.catch(e => {
					wx.showToast({
						title: '用户信息获取失败,请退出重试',
						icon: 'none',
						duration: 1000
					})
				})
		}

	},
	onShow(options) {

	},
	globalData: {
		isScope: 1,
		tabBar: {
			person: [{
					key: 'msg',
					icon: 'interactive',
					currentIcon: 'interactive_fill',
					title: '消息',
					url: '/pages/admin/person/msg/msg'
				},
				{
					key: 'cardcase',
					icon: 'businesscard',
					currentIcon: 'businesscard_fill',
					title: '收藏夹',
					url: '/pages/admin/person/cardcase/cardcase'
				},
				{
					key: 'team',
					icon: 'group',
					currentIcon: 'group_fill',
					title: '团队',
					url: '/pages/admin/person/team/team'
				},
				{
					key: 'mine',
					icon: 'mine',
					currentIcon: 'mine_fill',
					title: '个人中心',
					url: '/pages/admin/person/mine/index/index'
				}
			],
			team: [{
					key: 'member',
					icon: 'group',
					currentIcon: 'group_fill',
					title: '团队成员',
					url: '/pages/admin/team/member/member'
				},
				{
					key: 'manage',
					icon: 'createtask',
					currentIcon: 'createtask_fill',
					title: '团队管理',
					url: '/pages/admin/team/manage/index/index'
				},
				{
					key: 'mine',
					icon: 'mine',
					currentIcon: 'mine_fill',
					title: '团队中心',
					url: '/pages/admin/team/mine/index/index'
				},
			],
			card: []
		}
	},
	userInfo: null,
})
