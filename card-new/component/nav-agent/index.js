Component({
    properties: {
        joinedTeams: { // 属性名
            type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: {}, // 属性初始值（可选），如果未指定则会根据类型选择一个
            observer: function (newVal, oldVal, changedPath) {
                // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
                // 通常 newVal 就是新设置的数据， oldVal 是旧数据
            }
        },
    },
  pageLifetimes:{
    show: function () {
      // 页面被展示
      console.log('页面被展示')
      this.setData({
        navStates: false
      })
    },
  },
    data: {
        navStates: false,
        navData: [{
                name: 'team',
                icon: 'http://ii.sinelinked.com/miniProgramAssets/menu-sub-01.png',
                goto: '/pages/team/index/index'
            },
            {
                name: 'index',
                icon: 'http://ii.sinelinked.com/miniProgramAssets/menu-sub-06.png',
                goto: '/pages/agent/index/index'
            },
            {
                name: 'show',
                icon: 'http://ii.sinelinked.com/miniProgramAssets/menu-sub-03.png',
                goto: '/pages/agent/show/show'
            },
            {
                name: 'product',
                icon: 'http://ii.sinelinked.com/miniProgramAssets/menu-sub-04.png',
                goto: '/pages/agent/product/product'
            },
            {
                name: 'company',
                icon: 'http://ii.sinelinked.com/miniProgramAssets/menu-sub-05.png',
                goto: '/pages/agent/company/company'
            },
        ],
        visibleTeamChoose: false, //显示选择团队弹框
        teamChooseData: [
            // {
            // 	name: '记忆的时间差',
            // 	icon: 'group_fill',
            // 	color: '#ff9900'
            // }
        ],
        joinedTeams: [], //所属团队
        activeTeamid: '', //当前所选团队
    },
    methods: {
        navOpen() {
          console.log(this.data.navStates)
            this.setData({
                navStates: !this.data.navStates
            })
        },
        navClose() {
            this.setData({
                navStates: !this.data.navStates
            })
        },
        teamChooseHandle(e) {
            var index = e.detail.index
            wx.redirectTo({
                url: '/pages/team/index/index?teamId=' + this.data.teamChooseData[index].userId
            })
        },
        goTo(e) {
            var navName = e.currentTarget.dataset.name
            var goto = e.currentTarget.dataset.goto
            var getCurrentPagesNum = getCurrentPages()

            if (navName == 'team') {
                var joinedTeams = ''
                try {
                    joinedTeams = wx.getStorageSync('joinedTeams')
                    if (joinedTeams) {
                        // Do something with return value
                        if (joinedTeams.length == 1) {
                          wx.redirectTo({
                                url: goto + '?teamId=' + joinedTeams[0].userId
                            })
                            return
                        }
                        var joinedTeamsArr = []
                        joinedTeams.map(item => {
                            joinedTeamsArr.push({
                                name: item.userName,
                                userId: item.userId
                            })
                        })
                        this.setData({
                            visibleTeamChoose: true,
                            teamChooseData: joinedTeamsArr
                        })
                    }
                } catch (e) {
                    // Do something when catch error
                }

            } else {
                if (getCurrentPagesNum.length < 10) {
                  wx.redirectTo({
                        url: goto
                    })
                }else{
                    wx.reLaunch({
                        url: goto
                    })
                }
                
            }
        },

    }
});