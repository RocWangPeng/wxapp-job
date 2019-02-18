Component({
    pageLifetimes: {
        show() {
            try {
                var teamId = wx.getStorageSync('teamId')
                if (teamId) {
                    this.setData({
                        teamId: teamId
                    })
                }
            } catch (e) {
                // Do something when catch error
            }
        }
    },
    data: {
        teamId: '',
        navStates: true,
        navData: [{
                name: 'index',
                icon: 'http://ii.sinelinked.com/miniProgramAssets/menu-sub-06.png',
                goto: '/pages/team/index/index'
            },
            {
                name: 'member',
                icon: 'http://ii.sinelinked.com/miniProgramAssets/menu-sub-01.png',
                goto: '/pages/team/memberList/memberList'
            },
            {
                name: 'show',
                icon: 'http://ii.sinelinked.com/miniProgramAssets/menu-sub-03.png',
                goto: '/pages/team/show/show'
            },
            {
                name: 'article',
                icon: 'http://ii.sinelinked.com/miniProgramAssets/menu-sub-07.png',
                goto: '/pages/team/learn/learn'
            },
            // {
            //     name: 'company',
            //     icon: 'http://ii.sinelinked.com/miniProgramAssets/menu-sub-05.png',
            //     goto: '/pages/team/company/company'
            // },
        ]
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
        goTo(e) {
            var getCurrentPagesNum = getCurrentPages()
            var navName = e.currentTarget.dataset.name
            var goto = e.currentTarget.dataset.goto
            if (getCurrentPagesNum.length < 10) {
              wx.redirectTo({
                    url: goto + '?teamId=' + this.data.teamId
                })
            }else{
              wx.redirectTo({
                    url: goto + '?teamId=' + this.data.teamId
                })
            }

            

        },

    }
});