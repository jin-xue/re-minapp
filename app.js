// app.js
App({
  onLaunch() {
    wx.login({
      success: res => {
      }
    })
    const token = wx.getStorageSync('token');
    if (token) {
      wx.reLaunch({ url: '/pages/index/index' });
    } else {
      wx.reLaunch({ url: '/pages/login/login' });
    }
  },
  globalData: {
    userInfo: null
  }
})
