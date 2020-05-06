// 1.引入自己的axios库
import { axios } from '../../request/myAxios'
// 定义一个对象,里面放请求参数
const params = {
  query: '',
  cid: '',
  pagenum: 1,
  pagesize: 10
}
// 定义总数
let totalCount = 0;
Page({
  data: {
    activeIndex: 0,
    tabs: [
      {
        id: 1,
        name: '综合'
      },
      {
        id: 2,
        name: '销售'
      },
      {
        id: 3,
        name: '价格'
      }
    ],
    goodsList: [],
    showTop: false
  },
  // 点击切换 activeIndex 数据
  changeTabsIndex(e) {
    // console.log(e);
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
  },
  // options 页面加载后获取的参数
  onLoad(options) {
    // 如果值获取到的是 undefined，把值改成 ''
    // 从分类页过来的是传递分类 id
    params.cid = options.cat_id || '';
    // 从搜索页过来的是传递关键词
    params.query = options.query || '';
    this.geiGoodsList();
  },
  // axios请求
  geiGoodsList() {
    axios({
      url: '/goods/search',
      data: params
    }).then(res => {
      console.log(res);
      totalCount = res.total;
      this.setData({
        // 防止下拉获取数据覆盖之前的数据
        goodsList: [...this.data.goodsList, ...res.goods]
      })
      // 停止当前页面下拉刷新
      wx.stopPullDownRefresh();
    })
  },
  // 监听用户下拉刷新事件
  onPullDownRefresh() {
    this.setData({
      goodsList: []
    })
    params.pagenum = 1;
    this.geiGoodsList();
  },
  //监听用户上拉触底事件
  onReachBottom() {
    if (Math.ceil(totalCount / params.pagesize) > params.pagenum) {
      params.pagenum++;
      this.geiGoodsList();
    } else {
      // 显示消息提示框
      wx.showToast({ title: '没有数据了' });
    }
  },
  // 当页面滚动的时候触发
  // onPageScroll 监测屏幕的位置
  onPageScroll({ scrollTop }) {
    this.setData({
      showTop: scrollTop >= 100 ? true : false
    })
  }
})