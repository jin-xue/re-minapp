const BASE_URL = 'https://dashboard.datazhi.com/v1/api';

const request = (url, method = 'GET', data = {}, header = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      success: (res) => resolve(res.data),
      fail: (err) => reject(err)
    });
  });
};

const login = (usernameOrPhone, passwordOrCode, loginType = 1) => {
  return request('/login', 'POST', {
    usernameOrPhone,
    passwordOrCode,
    loginType
  });
};

module.exports = {
  request,
  login
}
