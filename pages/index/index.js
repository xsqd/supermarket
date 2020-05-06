import { axios } from '../../request/myAxios'
Page({
  data: {
    swiperList: [],
    navList: [],
    floorList: [],
    showTop: false
  },
  onLoad() {
    // 1.banner图请求
    axios({
      url: '/home/swiperdata'
    }).then(res => {
      // 把路径的 main 替换成 index ，让轮播图能跳转 
      res.forEach(item => {
        item.navigator_url = item.navigator_url.replace('/main', '/index');
      });
      // 更新视图
      this.setData({
        swiperList: res
      });
    }),
      // 导航栏请求
      axios({
        url: '/home/catitems'
      }).then(res => {
        this.setData({
          navList: res
        })
      }),
      // 商品楼层请求
      axios({
        url: '/home/floordata'
      }).then(res => {
        console.log('1', res);
        res.forEach(item => {
          item.product_list.forEach(v => {
            v.navigator_url = v.navigator_url.replace('?', '/index?');
          })
        })
        this.setData({
          floorList: res
        })
      })
  },
  // 监听用户下拉动作,用户下拉，重新加载页面
  onPullDownRefresh() {
    this.setData({
      swiperList: [],
      navList: [],
      floorList: []
    }),
      this.onLoad();
  },
  // 当页面滚动的时候触发
  // onPageScroll 监测屏幕的位置
  onPageScroll({ scrollTop }) {
    this.setData({
      showTop: scrollTop >= 100 ? true : false
    })
  }
})