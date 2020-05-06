// components/to-top/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击触发滚动,返回顶部
    goToTop() {
      // pageScrollTo 滚动事件
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    }
  }
})
