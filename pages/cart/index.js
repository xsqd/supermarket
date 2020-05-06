// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart: [],
    totalPrice: 0,
    totalcount: 0,
    selectAll: true
  },


  /**
   * 生命周期函数--监听页面显示
   * tab 页面不会卸载,如果用 onLoad 只会在刚开始加载一次,而 cart 数据是实时更新的,所以用 onShow
   */
  onShow: function () {
    const cart = wx.getStorageSync('cart');
    this.setData({
      cart
    }),
      this.cartComputed(cart);
  },
  // 商品计算总价格及选中数量
  cartComputed(cart) {
    let totalPrice = 0,
      totalcount = 0,
      selectAll = true
    cart.forEach(item => {
      if (item.isSelect) {
        totalPrice += item.goods_price * item.number;
        totalcount++;
      } else {
        // 如果有一个没有选中后,则全选不选中
        selectAll = false;
      }
    });
    // 当 cart 中,不存在数据时,全选状态为 false
    if (cart.length === 0) selectAll = false;
    this.setData({
      totalPrice, totalcount, selectAll
    })
    // 每一次计算金额后,自动存储本地
    wx.setStorageSync('cart', cart);
  },
  // 全选按钮点击事件
  changSelectAll() {
    let { selectAll, cart } = this.data;
    selectAll = !selectAll;
    cart.forEach(item => {
      item.isSelect = selectAll
    });
    this.setData({
      cart, selectAll
    });
    // 根据选中商品重新计算价格
    this.cartComputed(cart);
  },
  // 点击修改单个商品选中状态
  changselect(e) {
    // console.log(e);
    const { index } = e.currentTarget.dataset;
    let { cart } = this.data;
    cart[index].isSelect = !cart[index].isSelect;
    this.setData({
      cart
    })
    // 根据选中商品重新计算价格
    this.cartComputed(cart);
  },
  // 点击减少商品数量
  changcountReduce(e) {
    // console.log(e);
    const { index } = e.currentTarget.dataset;
    let { cart } = this.data;
    if (cart[index].number > 1) {
      cart[index].number--;
    } else {
      wx.showModal({
        title: '是否删除该商品',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '删除',
        confirmColor: '#ea4350',
        success: (result) => {
          if (result.confirm) {
            cart.splice(index, 1)
            this.setData({
              cart
            });
            // 根据选中商品重新计算价格
            this.cartComputed(cart);
          }
        }
      });
    };
    this.setData({
      cart
    });
    // 根据选中商品重新计算价格
    this.cartComputed(cart);
  },
  // 点击添加商品数量
  changcountAdd(e) {
    const { index } = e.currentTarget.dataset;
    let { cart } = this.data;
    if (cart[index].number < 9999) {
      cart[index].number++;
    } else {
      wx.showToast({
        title: '库存不足',
        icon: 'none',
        mask: true
      });
    };
    this.setData({
      cart
    });
    // 根据选中商品重新计算价格
    this.cartComputed(cart);
  },
  // 点击跳转到支付页面
  goToPay() {
    const { totalcount } = this.data;
    if (totalcount) {
      wx.navigateTo({
        url: '/pages/pay/index'
      });
    } else {
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        mask: true
      });
    }
  }
})