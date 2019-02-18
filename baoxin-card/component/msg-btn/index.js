Component({
    properties: {
    },
    methods:{
        ToMsg(){
            try {
                var userType = wx.getStorageSync('userType')
                if (userType == 'agent') {
                    wx.navigateTo({
                        url: '/pages/agent/msg/msg'
                    })
                }else if(userType == 'team'){
                    wx.navigateTo({
                        url: '/pages/team/msg/msg'
                    })
                }
        }catch (e) {
            // Do something when catch error
          }
    }
}
});
