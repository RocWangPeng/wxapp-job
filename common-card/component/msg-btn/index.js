Component({
    properties: {
    },
    methods:{
        ToMsg(){
            try {
                var userType = wx.getStorageSync('userType') || 'person'
                if (userType == 'person') {
                    wx.navigateTo({
                        url: '/pages/card/person/msg/msg'
                    })
                }else if(userType == 'team'){
                    wx.navigateTo({
                        url: '/pages/card/team/msg/msg'
                    })
                }
        }catch (e) {
            console.log(e);
          }
    }
}
});
