const { $Toast } = require('../../dist/base/index');

Component({
  pageLifetimes:{
    show: function () {
      // 页面被展示
      this.setData({
        navStates: false
      })
    },
  },
    data: {
        navStates: false,
        navData: [
            {
                name: 'index',
                icon: 'http://ii.sinelinked.com/miniProgramAssets/menu-sub-06.png',
                goto: '/pages/agent/index/index'
            },
            {
                name: 'introduce',
                icon: 'http://ii.sinelinked.com/miniProgramAssets/menu-sub-02.png',
                goto: '/pages/agent/introduce/introduce'
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
//             {
//                 name: 'company',
//                 icon: 'http://ii.sinelinked.com/miniProgramAssets/menu-sub-05.png',
//                 goto: '/pages/agent/company/company'
//             },
            {
                name: 'team',
                icon: 'http://ii.sinelinked.com/miniProgramAssets/menu-sub-01.png',
                goto: '/pages/team/index/index'
            }
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
            var userId = e.currentTarget.dataset.userid
            wx.redirectTo({
                url: '/pages/team/index/index?teamId=' + userId
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
                        console.log(joinedTeams);
                        if(joinedTeams.length == 0){
                           
                            wx.showToast({
                                title: '还未加入任何团队',
                                icon: 'none',
                                duration: 2000
                              })
                            return
                        }
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