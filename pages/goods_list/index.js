// 1.引入自己的axios库
import { axios } from '../../request/myAxios'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    axios({
      url: '/goods/qsearch',
      data: {
        query: options.query
      }
    }).then(res => {
      console.log(res);
      this.setData({
        goodsList: res
      })
    })
  }
})