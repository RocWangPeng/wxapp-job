// router.js
module.exports = {

    navigateTo(object) {
        if (getCurrentPages().length > 9) {
            this.redirectTo(object)
        } else {
            wx.navigateTo(object)
        }
    },
    // 其他跳转不处理
    navigateBack(object) {
        wx.navigateBack(object)
    },

    switchTab(object) {
        wx.switchTab(object)
    },

    redirectTo(object) {
        wx.redirectTo(object)
    },

    reLaunch(object) {
        wx.reLaunch(object)
    },

}
