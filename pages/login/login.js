const { login: loginApi } = require('../../utils/api');

Component({
  properties: {},
  data: {
    username: '',
    password: '',
    showToast: false,
    toastMessage: ''
  },
  methods: {
    showToast(message) {
      this.setData({ showToast: true, toastMessage: message });
      setTimeout(() => {
        this.setData({ showToast: false });
      }, 2000);
    },
    login() {
      const username = this.data.username;
      const password = this.data.password;
      
      if (!username) {
        this.showToast('请输入用户名');
        return;
      }
      if (!password) {
        this.showToast('请输入密码');
        return;
      }
      
      loginApi(username, password, 1).then((res) => {
        console.log('登录返回完整数据', res);
        if (res.resCode === "0") {
          console.log('登录成功，准备跳转');
          wx.setStorageSync('token', res.data.token);
          this.showToast('登录成功');
          setTimeout(() => {
            console.log('执行跳转');
            wx.switchTab({ url: '/pages/index/index' });
          }, 1500);
        } else {
          console.log('登录失败，code不为0');
          this.showToast(res.resMsg || res.message || '登录失败');
        }
      }).catch((err) => {
        console.error('登录失败', err);
        this.showToast('网络错误');
      });
    },
    onUsernameInput(e) {
      this.setData({ username: e.detail.value });
    },
    onPasswordInput(e) {
      this.setData({ password: e.detail.value });
    }
  }
});
