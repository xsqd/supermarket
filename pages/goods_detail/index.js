// 1.引入自己封装的axios库
import { axios } from '../../request/myAxios'
Page({
  goodsObj: {},
  data: {
    // 商品图片
    pics: [],
    // 商品价格
    goods_price: '',
    // 商品名称
    goods_name: '',
    // 商品详情
    goods_introduce: ''
  },
  onLoad(options) {
    this.getGoodsDetail();
  },
  getGoodsDetail() {
    // 通过页面实例获取页面参数 页面实例 this.options  参数 goods_id 
    const { goods_id } = this.options;
    axios({
      url: '/goods/detail',
      data: {
        goods_id
      }
    }).then(res => {
      console.log(res);
      let { pics, goods_price, goods_name, goods_introduce } = res;
      // 获取用户当前系统信息
      const { system } = wx.getSystemInfoSync();
      // 判断是否为 IOS 平台，如果是，就用正则把 web 图片路径替换一下
      if (system.toLowerCase().indexOf('ios') > -1) {
        goods_introduce = goods_introduce.replace(/\?.+?webp/g, '');
      }
      // 更新数据
      this.setData({
        pics, goods_price, goods_name, goods_introduce
      })
      this.goodsObj = {
        goods_name,
        goods_price,
        goods_id,
        goods_image: res.goods_small_logo
      }
    })
  },
  // 点击图片在新页面中全屏预览图片
  showBigImg(e) {
    // console.log(e);
    const { current } = e.currentTarget.dataset;
    const urls = this.data.pics.map(item => item.pics_big);
    wx.previewImage({
      current,
      urls
    });
  },
  // 点击加入购物车
  addToCart() {
    // 获取本地数据 cart 当 cart 不存在时, 初始化为空数组
    const cart = wx.getStorageSync('cart') || [];
    // 通过 findIndex 判断 cart 中是否有该商品  index 为-1 则 不存在 ,否则返回对应的 index 索引
    const index = cart.findIndex(item => item.goods_id === this.goodsObj.goods_id);
    // 不存在则添加
    if (index === -1) {
      // 添加商品选中状态
      this.goodsObj.isSelect = true;
      // 添加商品初始数量
      this.goodsObj.number = 1;
      // cart 中前添加对象 this.goodsObj
      cart.unshift(this.goodsObj)
    } else {
      // 存在则数量加1
      cart[index].number++;
    }
    wx.setStorageSync('cart', cart)
    // 提示
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      mask: true
    })
  },
  // 点击购物车跳转到购物车页面
  goPageCart() {
    // 跳转 tab 页 用 switchTab
    wx.switchTab({
      url: '/pages/cart/index'
    });
  },
  // 收藏
  addToCollect() {
    console.log('收藏成功');
  },
  // 立即购买
  bugNow() {
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
      success: () => {
        // 添加本地
        this.addToCart()
      }
    });
  }
})