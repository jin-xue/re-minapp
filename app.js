// app.js
App({
  onLaunch() {
    const token = wx.getStorageSync('token');
    if (token) {
      wx.switchTab({ url: '/pages/index/index' });
    }
  },
  globalData: {
    userInfo: null
  }
})
