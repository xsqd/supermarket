// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personalList: [
      {
        icon: 'icon-daifukuan1',
        name: '待付款',
        type: 2
      },
      {
        icon: 'icon-daishouhuo',
        name: '待收货',
        type: 3
      },
      {
        icon: 'icon-tuikuan',
        name: '退货/退款'
      },
      {
        icon: 'icon-quanbudingdan01',
        name: '全部订单',
        type: 1
      },
    ],
    personalFunction: [
      {
        icon: 'icon-kefu2',
        name: '联系客服',
        value: '400-618-4000'
      },
      {
        icon: 'icon-yjfk',
        name: '意见反馈',
        value: ''
      },
      {
        icon: 'icon-banben',
        name: '当前版本',
        value: 'v4.1.1'
      },
    ],
    userInfo: {},
    activeIndex: 0
  },
  changeListIndex(e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
  },
  onLoad() {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    })
  }
})