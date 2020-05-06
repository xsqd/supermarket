import { axios } from '../../request/myAxios';
import { formatTime } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ordersList: [],
    activeIndex: 0,
    tabs: [
      {
        id: 1,
        name: '全部'
      },
      {
        id: 2,
        name: '待付款'
      },
      {
        id: 3,
        name: '待发货'
      }
    ],

  },
  // 点击切换 activeIndex 数据
  changeTabsIndex(e) {
    // console.log(e);
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
    this.getCorderData(this.data.activeIndex + 1)
  },
  getCorderData(type = 2) {
    axios({
      url: '/my/orders/all',
      data: {
        type
      }
    }).then(res => {
      const { orders } = res;
      orders.forEach(item => {
        item.format_time = formatTime(new Date(item.create_time * 1000));
      });
      this.setData({
        ordersList: orders
      })
    })
  },
  onLoad(options) {
    const type = options.type || 1
    this.getCorderData(type);
    this.setData({
      activeIndex: type - 1
    })
  }
})