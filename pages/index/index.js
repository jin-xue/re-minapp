const api = require('../../utils/api.js');

Page({
  data: {
    stats: {},
    records: [],
    goodsList: [],
    showInModal: false,
    showOutModal: false,
    inGoodIndex: 0,
    outGoodIndex: 0,
    inForm: {
      goodsId: null,
      qty: '',
      purchasePrice: '',
      warehouse: '',
      remark: ''
    },
    outForm: {
      goodsId: null,
      qty: '',
      sellPrice: '',
      remark: ''
    }
  },

  onLoad() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.redirectTo({ url: '/pages/login/login' });
      return;
    }
    this.loadGoodsList();
    this.loadStats();
    this.loadRecentRecords();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
    const token = wx.getStorageSync('token');
    if (!token) return;
    this.loadGoodsList();
    this.loadStats();
    this.loadRecentRecords();
  },

  loadGoodsList() {
    api.getGoodList({ pageNum: 1, pageSize: 100 }).then(res => {
      if (res.resCode === '0') {
        this.setData({ goodsList: res.data.resultData || [] });
      }
    });
  },

  loadStats() {
    api.getStockStats().then(res => {
      if (res.resCode === '0') {
        this.setData({ stats: res.data || {} });
      }
    });
  },

  loadRecentRecords() {
    api.getRecentRecords(20).then(res => {
      if (res.resCode === '0') {
        this.setData({ records: res.data || [] });
      }
    });
  },

  showStockInModal() {
    this.setData({
      showInModal: true,
      inForm: { goodsId: null, qty: '', purchasePrice: '', warehouse: '', remark: '' },
      inGoodIndex: 0
    });
  },

  showStockOutModal() {
    this.setData({
      showOutModal: true,
      outForm: { goodsId: null, qty: '', sellPrice: '', remark: '' },
      outGoodIndex: 0
    });
  },

  closeModals() {
    this.setData({ showInModal: false, showOutModal: false });
  },

  onInGoodChange(e) {
    const index = e.detail.value;
    const good = this.data.goodsList[index];
    if (good) {
      this.setData({
        inGoodIndex: index,
        'inForm.goodsId': good.id
      });
    }
  },

  onInQtyInput(e) {
    this.setData({ 'inForm.qty': parseInt(e.detail.value) || '' });
  },

  onInPriceInput(e) {
    this.setData({ 'inForm.purchasePrice': parseFloat(e.detail.value) || '' });
  },

  onInWarehouseInput(e) {
    this.setData({ 'inForm.warehouse': e.detail.value });
  },

  onInRemarkInput(e) {
    this.setData({ 'inForm.remark': e.detail.value });
  },

  onOutGoodChange(e) {
    const index = e.detail.value;
    const good = this.data.goodsList[index];
    if (good) {
      this.setData({
        outGoodIndex: index,
        'outForm.goodsId': good.id
      });
    }
  },

  onOutQtyInput(e) {
    const value = e.detail.value;
    if (value === '' || (/^\d+$/.test(value))) {
      this.setData({ 'outForm.qty': value });
    }
  },

  onOutPriceInput(e) {
    this.setData({ 'outForm.sellPrice': parseFloat(e.detail.value) || '' });
  },

  onOutRemarkInput(e) {
    this.setData({ 'outForm.remark': e.detail.value });
  },

  submitStockIn() {
    const { inForm } = this.data;
    if (!inForm.goodsId) {
      wx.showToast({ title: '请选择商品', icon: 'none' });
      return;
    }
    if (!inForm.qty) {
      wx.showToast({ title: '请输入数量', icon: 'none' });
      return;
    }

    api.stockIn(inForm).then(res => {
      if (res.resCode === '0') {
        wx.showToast({ title: '入库成功', icon: 'success' });
        this.closeModals();
        this.loadStats();
        this.loadRecentRecords();
      } else {
        wx.showToast({ title: res.resMsg || '入库失败', icon: 'none' });
      }
    });
  },

  submitStockOut() {
    const { outForm } = this.data;
    if (!outForm.goodsId) {
      wx.showToast({ title: '请选择商品', icon: 'none' });
      return;
    }
    if (!outForm.qty) {
      wx.showToast({ title: '请输入数量', icon: 'none' });
      return;
    }
    if (!outForm.sellPrice) {
      wx.showToast({ title: '请输入售价', icon: 'none' });
      return;
    }

    const submitData = {
      goodsId: outForm.goodsId,
      qty: parseInt(outForm.qty),
      sellPrice: parseFloat(outForm.sellPrice)
    };

    api.stockOut(submitData).then(res => {
      if (res.resCode === '0') {
        wx.showToast({ title: '出库成功', icon: 'success' });
        this.closeModals();
        this.loadStats();
        this.loadRecentRecords();
      } else {
        wx.showToast({ title: res.resMsg || '出库失败', icon: 'none' });
      }
    });
  }
});
