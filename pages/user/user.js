const api = require('../../utils/api.js');

Page({
  data: {
    userInfo: null
  },

  onLoad() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.redirectTo({ url: '/pages/login/login' });
      return;
    }
    this.loadUserInfo();
  },

  loadUserInfo() {
    api.getUserInfo().then(res => {
      if (res.resCode === '0') {
        this.setData({ userInfo: res.data });
      }
    });
  },

  onAboutUs() {
    wx.showModal({
      title: '关于我们',
      content: '金诚商贸行库存管理系统',
      showCancel: false
    });
  },

  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.reLaunch({ url: '/pages/login/login' });
        }
      }
    });
  }
});
