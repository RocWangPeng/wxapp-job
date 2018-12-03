Component({
    pageLifetimes:{
        show(){
            try {
                var teamId = wx.getStorageSync('teamId')
                if (teamId) {
                    this.setData({teamId:teamId})
                }
              } catch (e) {
                // Do something when catch error
              }
        }
    },
    data:{
        teamId:'',
        navStates:true,
        navData:[
            {
                name:'index',
                icon:'http://ii.sinelinked.com/miniProgramAssets/menu-sub-06.png',
                goto:'/pages/team/index/index'
             },
             {
                name:'show',
                icon:'http://ii.sinelinked.com/miniProgramAssets/menu-sub-03.png',
                goto:'/pages/team/show/show' 
             },
             {
                name:'member',
                icon:'http://ii.sinelinked.com/miniProgramAssets/menu-sub-01.png',
                goto:'/pages/team/memberList/memberList' 
             },
        ]
    },
    methods:{
        navOpen(){
            this.setData({
                navStates:!this.data.navStates
            })
        },
      navClose(){
        this.setData({
          navStates: !this.data.navStates
        })
      },
      goTo(e){
        var navName = e.currentTarget.dataset.name
        var goto = e.currentTarget.dataset.goto
        wx.redirectTo({
            url: goto+'?teamId='+this.data.teamId
          })

      },
     
    }
});
