const BASE_URL = 'https://dashboard.datazhi.com/v1/api';

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

const getStockStats = () => {
  return request('/re/stock/stats', 'GET');
};

const getRecentRecords = (limit = 20) => {
  return request('/re/stock/record/recent', 'GET', { limit });
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
