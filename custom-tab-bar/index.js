Component({
  data: {
    selected: 0,
    color: "#999999",
    selectedColor: "#147fed",
    tabBarHeight: 50,
    list: [
      {
        pagePath: "/pages/index/index",
        text: "首页",
        icon: "/resource/tab/home.png",
        selectedIcon: "/resource/tab/home-active.png"
      },
      {
        pagePath: "/pages/list/list",
        text: "库存",
        icon: "/resource/tab/stock.png",
        selectedIcon: "/resource/tab/stock-active.png"
      },
      {
        pagePath: "/pages/user/user",
        text: "我的",
        icon: "/resource/tab/me.png",
        selectedIcon: "/resource/tab/me-active.png"
      }
    ]
  },

  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      this.setData({ selected: data.index });
      wx.switchTab({ url });
    }
  },

  attached() {
    this.setData({ tabBarHeight: 50 });
  }
});
