const BASE_URL = 'https://dashboard.datazhi.com/v1/api';

const handleUnauthorized = () => {
  try {
    wx.removeStorageSync('token');
  } catch (e) {}

  try {
    const pages = getCurrentPages ? getCurrentPages() : [];
    const current = pages.length ? pages[pages.length - 1] : null;
    const route = current && current.route ? '/' + current.route : '';
    if (route !== '/pages/login/login') {
      wx.reLaunch({ url: '/pages/login/login' });
    }
  } catch (e) {
    wx.reLaunch({ url: '/pages/login/login' });
  }
};

const getAuthHeader = () => {
  const token = wx.getStorageSync('token');
  return token ? { 'Authorization': token } : {};
};

const request = (url, method = 'GET', data = {}, header = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
        ...header
      },
      success: (res) => {
        const payload = res.data;
        if (payload && (payload.resCode === '-1000' || payload.resCode === -1000)) {
          handleUnauthorized();
          reject(payload);
          return;
        }
        resolve(payload);
      },
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

const getUserInfo = () => {
  return request('/userinfo', 'GET');
};

const getGoodList = (data) => {
  return request('/re/good/list', 'POST', data);
};

const upsertGood = (data) => {
  return request('/re/good/upsert', 'POST', data);
};

const deleteGood = (id) => {
  return request('/re/good/delete?id=' + id, 'DELETE', {});
};

const getStockList = (data) => {
  return request('/re/stock/list', 'POST', data);
};

const stockIn = (data) => {
  return request('/re/stock/in', 'POST', data);
};

const stockOut = (data) => {
  return request('/re/stock/out', 'POST', data);
};

const getStockStats = (params = {}) => {
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  return request('/re/stock/stats' + (query ? '?' + query : ''), 'GET');
};

const getRecentRecords = (limit = 20, params = {}) => {
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  return request('/re/stock/record/recent' + (query ? '?' + query : ''), 'GET');
};

const uploadFile = (filePath) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: BASE_URL + '/file',
      filePath: filePath,
      name: 'file',
      header: getAuthHeader(),
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data && (data.resCode === '-1000' || data.resCode === -1000)) {
          handleUnauthorized();
          reject(data);
          return;
        }
        resolve(data);
      },
      fail: (err) => reject(err)
    });
  });
};

module.exports = {
  request,
  login,
  getGoodList,
  upsertGood,
  deleteGood,
  getStockList,
  stockIn,
  stockOut,
  getStockStats,
  getRecentRecords,
  uploadFile,
  getUserInfo
}
