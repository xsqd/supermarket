import { axios } from '../../request/myAxios';
import regeneratorRuntime from '../../libs/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart: [],
    userAddRess: {},
    totalPrice: 0,
    totalcount: 0
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let cart = wx.getStorageSync('cart');
    // 过滤出选中的商品
    cart = cart.filter(v => v.isSelect)
    // 一开始就获取地址
    const userAddRess = wx.getStorageSync('userAddRess');
    this.setData({
      cart, userAddRess
    })
    this.cartComputed(cart);
  },
  // 点击选择地址
  getUserAddress() {
    // 1.获取用户授权情况
    wx.getSetting({
      success: (result) => {
        const scopeAddress = result.authSetting['scope.address'];
        // 已授权 或者是 undefined 引导授权调用接口
        if (scopeAddress || scopeAddress === undefined) {
          // 授权成功,调用接口,获取用户地址信息
          wx.chooseAddress({
            success: (result) => {
              console.log(result);
              const { userName, telNumber, provinceName, detailInfo, countyName, cityName } = result;
              const userAddRess = {
                userName,
                telNumber,
                delite: provinceName + cityName + countyName + detailInfo
              }
              this.setData({
                userAddRess
              })
              // 存储到本地
              wx.setStorageSync('userAddRess', userAddRess);
            }
          });
        } else {
          // 取消授权,打开手机设置页面,手动允许
          wx.openSetting();

        }
      }
    });

  },
  // 商品计算总价格及选中数量
  cartComputed(cart) {
    let totalPrice = 0,
      totalcount = 0
    cart.forEach(item => {
      if (item.isSelect) {
        totalPrice += item.goods_price * item.number;
        totalcount++;
      }
    });
    this.setData({
      totalPrice, totalcount
    })
  },
  // 点击支付按钮
  async payOrder() {
    // 判断是否有收获地址
    const { userName } = this.data.userAddRess;
    if (!userName) {
      wx.showToast({
        title: '请选择收获地址',
        icon: 'none'
      });
    } else {
      // 判断是否登录,没有登录跳转到授权页面
      const token = wx.getStorageSync('token');
      if (!token) {
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 500,
          success: (result) => {
            wx.navigateTo({
              url: '/pages/auth/index'
            });
          }
        });
      } else {
        // 有则跳转到订单页

        // 总价格
        const order_price = this.data.totalPrice;
        // 地址
        const consignee_addr = this.data.userAddRess.delite;
        // 商品列表
        const goods = this.data.cart.filter(v => v.isSelect).map(v => ({
          goods_id: v.goods_id,
          goods_number: v.number,
          goods_price: v.goods_price
        }));
        try {
          // 创建订单,获取订单编号
          const { order_number } = await axios({
            url: '/my/orders/create',
            method: 'post',
            data: {
              // 商品列表
              goods,
              // 收获地址
              consignee_addr,
              // 总价格
              order_price
            }
          });
          // 通过订单号生成微信支付需要的参数(对象格式)
          const { pay } = await axios({
            method: 'POST',
            url: '/my/orders/req_unifiedorder',
            data: { order_number }
          });

          // 调用微信支付功能
          await wx.requestPayment(pay);

          // 发请求，检查订单是否已支付，已支付由后端更新订单状态
          await axios({
            url: '/my/orders/chkOrder',
            method: 'post',
            data: {
              order_number
            }
          })

          // 支付后调用的函数
          this.payOrderSuccess();

        } catch (error) {
          wx.showToast({
            title: '出现错误，支付失败',
            icon: 'none',
          })
        }
      }
    }
  },
  // 支付成功
  payOrderSuccess() {
    // 过滤出 cart 中 没有选中的，重新保存在本地中，覆盖掉之前的 cart
    let cart = wx.getStorageSync('cart');
    // 过滤出没有选中的商品
    cart = cart.filter(v => !v.isSelect) || []
    wx.setStorageSync('cart', cart);
    // 跳转到订单页面
    wx.redirectTo({
      url: '/pages/order/index',
    });
  }
})