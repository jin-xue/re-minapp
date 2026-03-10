const api = require('../../utils/api.js');

const categories = ['香烟', '酒', '生活用品', '零食', '饮料', '其他'];

Page({
  data: {
    list: [],
    pageNum: 1,
    pageSize: 10,
    loading: false,
    noMore: false,
    refreshing: false,
    showModal: false,
    isEdit: false,
    categories: categories,
    categoryIndex: 0,
    searchName: '',
    searchCategoryIndex: 0,
    defaultImg: '',
    form: {
      id: null,
      goodsName: '',
      category: '',
      brand: '',
      spec: '',
      sellPrice: '',
      img: ''
    }
  },

  onLoad() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.redirectTo({ url: '/pages/login/login' });
      return;
    }
    this.generateDefaultImg();
    this.loadList();
  },

  generateDefaultImg() {
    const query = wx.createSelectorQuery();
    query.select('#defaultCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);
        
        // 浅灰色背景
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, 120, 120);
        
        // 灰色图标
        ctx.fillStyle = '#cccccc';
        ctx.font = '40px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📦', 60, 50);
        
        ctx.font = '14px sans-serif';
        ctx.fillText('暂无图片', 60, 85);
        
        setTimeout(() => {
          wx.canvasToTempFilePath({
            canvas: canvas,
            success: (res) => {
              this.setData({ defaultImg: res.tempFilePath });
            }
          });
        }, 100);
      });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
    const token = wx.getStorageSync('token');
    if (!token) return;
    this.loadList(false);
  },

  loadList(loadMore = false) {
    if (this.data.loading) return;
    
    const pageNum = loadMore ? this.data.pageNum + 1 : 1;
    
    this.setData({ loading: true });
    
    const searchData = {
      pageNum: pageNum,
      pageSize: this.data.pageSize
    };
    
    if (this.data.searchName) {
      searchData.goodsName = this.data.searchName;
    }
    if (this.data.searchCategoryIndex > 0) {
      searchData.category = categories[this.data.searchCategoryIndex];
    }

    const formatProfitRate = (rate) => {
      if (rate === undefined || rate === null || rate === '') return '0.00';
      const num = parseFloat(rate);
      if (isNaN(num)) return '0.00';
      return (num * 100).toFixed(2);
    };
    
    api.getStockList(searchData).then(res => {
      if (res.resCode === '0') {
        const resultData = res.data?.resultData || [];
        const newList = resultData.map(item => ({
          ...item,
          profitRateDisplay: formatProfitRate(item.profitRate)
        }));
        this.setData({
          list: loadMore ? [...this.data.list, ...newList] : newList,
          pageNum: pageNum,
          noMore: newList.length < this.data.pageSize,
          loading: false,
          refreshing: false
        });
      } else {
        this.setData({ loading: false, refreshing: false });
        wx.showToast({ title: res.resMsg || '加载失败', icon: 'none' });
      }
    }).catch(() => {
      this.setData({ loading: false, refreshing: false });
    });
  },

  onPullDownRefresh() {
    this.setData({ refreshing: true, noMore: false });
    this.loadList(false);
  },

  onReachBottom() {
    if (!this.data.noMore) {
      this.loadList(true);
    }
  },

  showUpsertModal(e) {
    const item = e.currentTarget.dataset.item;
    let categoryIndex = 0;
    if (item && item.category) {
      categoryIndex = categories.indexOf(item.category);
      if (categoryIndex === -1) categoryIndex = 0;
    }
    if (item) {
      this.setData({
        showModal: true,
        isEdit: true,
        categoryIndex: categoryIndex,
        form: {
          id: item.goodsId,
          goodsName: item.goodsName,
          category: item.category || '',
          brand: item.brand || '',
          spec: item.spec || '',
          sellPrice: item.sellPrice || '',
          img: item.img || ''
        }
      });
    } else {
      this.setData({
        showModal: true,
        isEdit: false,
        categoryIndex: 0,
        form: {
          id: null,
          goodsName: '',
          category: categories[0],
          brand: '',
          spec: '',
          sellPrice: '',
          img: ''
        }
      });
    }
  },

  closeModal() {
    this.setData({ showModal: false });
  },

  onSearchNameInput(e) {
    this.setData({ searchName: e.detail.value });
  },

  onSearchCategoryChange(e) {
    this.setData({ searchCategoryIndex: parseInt(e.detail.value) });
  },

  onSearch() {
    this.setData({ pageNum: 1, noMore: false });
    this.loadList(false);
  },

  onClearFilter() {
    this.setData({
      searchName: '',
      searchCategoryIndex: 0,
      pageNum: 1,
      noMore: false
    });
    this.loadList(false);
  },

  onNameInput(e) {
    this.setData({ 'form.goodsName': e.detail.value });
  },

  onCategoryChange(e) {
    const index = e.detail.value;
    this.setData({
      categoryIndex: index,
      'form.category': categories[index]
    });
  },

  onBrandInput(e) {
    this.setData({ 'form.brand': e.detail.value });
  },

  onSpecInput(e) {
    this.setData({ 'form.spec': e.detail.value });
  },

  onPriceInput(e) {
    const value = e.detail.value;
    const num = parseFloat(value);
    if (value === '' || (!isNaN(num) && isFinite(num))) {
      this.setData({ 'form.sellPrice': value });
    } else {
      wx.showToast({ title: '请输入有效数字', icon: 'none' });
    }
  },

  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        wx.showLoading({ title: '上传中...' });
        
        api.uploadFile(tempFilePath).then(data => {
          wx.hideLoading();
          if (data.resMsg) {
            this.setData({ 'form.img': data.resMsg });
          } else {
            wx.showToast({ title: data.resMsg || '上传失败', icon: 'none' });
          }
        }).catch(() => {
          wx.hideLoading();
          wx.showToast({ title: '上传失败', icon: 'none' });
        });
      }
    });
  },

  submitForm() {
    const { form } = this.data;
    if (!form.goodsName) {
      wx.showToast({ title: '请输入商品名称', icon: 'none' });
      return;
    }
    if (!form.sellPrice) {
      wx.showToast({ title: '请输入售价', icon: 'none' });
      return;
    }

    const submitData = {
      goodsName: form.goodsName,
      category: form.category,
      sellPrice: parseFloat(form.sellPrice),
      img: form.img
    };
    
    if (form.id) {
      submitData.id = form.id;
    }

    api.upsertGood(submitData).then(res => {
      if (res.resCode === '0') {
        wx.showToast({ title: '保存成功', icon: 'success' });
        this.closeModal();
        this.onPullDownRefresh();
      } else {
        wx.showToast({ title: res.resMsg || '保存失败', icon: 'none' });
      }
    });
  },

  deleteGood(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该商品吗？',
      success: (res) => {
        if (res.confirm) {
          api.deleteGood(id).then(data => {
            if (data.resCode === '0') {
              wx.showToast({ title: '删除成功', icon: 'success' });
              this.onPullDownRefresh();
            } else {
              wx.showToast({ title: data.resMsg || '删除失败', icon: 'none' });
            }
          });
        }
      }
    });
  },
});
