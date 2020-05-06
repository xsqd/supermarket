// 1.导入自己封装的 axios 库
import { axios } from '../../request/myAxios'
// 2.定义一个变量用来存放所有的分类数据
let cateAll;

Page({

  data: {
    activeIndex: 0,
    cateLeft: [],
    cateRigth: []
  },
  // 点击修改 activeIndex
  changactiveIndex(e) {
    // console.log(e);
    const { index } = e.currentTarget.dataset;
    this.setData({
      activeIndex: index,
      // 根据左侧的索引值重新绑定右侧的楼层数据
      cateRigth: cateAll[index].children,
      // 点击左侧的时候，右侧的楼层都从一楼开始
      rightScrollTop: 0
    })
  },
  onLoad() {
    const cates = wx.getStorageSync('cates');
    if (!cates) {
      this.getCateData();
    } else {
      // 超过5分钟,重新请求
      if (Date.now() - cates.time > 1000 * 60 * 5) {
        // console.log("超时");
        this.getCateData();
      } else {
        cateAll = cates.data;
        const cateLeft = cateAll.map(item => ({
          cat_id: item.cat_id,
          cat_name: item.cat_name
        }))
        // 默认右侧绑定数据为数组中的第一项
        const cateRigth = cateAll[0].children
        this.setData({
          cateLeft,
          cateRigth
        })
      }
    }

  },
  getCateData() {
    axios({
      url: '/categories'
    }).then(res => {
      console.log(res);
      // 映射返回的数据，只保留 cat_id 和 cat_name
      const cateLeft = res.map(item => ({
        cat_id: item.cat_id,
        cat_name: item.cat_name
      }))
      // 默认右侧绑定数据为数组中的第一项
      const cateRigth = res[0].children
      this.setData({
        cateLeft,
        cateRigth
      })
      // 获取的数据存放在 cateAll 中,以便左边绑定
      cateAll = res;
      // 将数据存放进本地 setStorageSync 中 time: Date.now() 获取现在的毫秒 
      wx.setStorageSync('cates', { time: Date.now(), data: res });
    })
  }
})