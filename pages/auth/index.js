import regeneratorRuntime from '../../libs/runtime/runtime';
import { axios } from '../../request/myAxios'
Page({
  // 1. 获取用户信息 
  //   返回  `encryptedData,rawData,iv,signature`
  // 2. 小程序登录  
  //   返回 `code`
  // 3. 提交数据到自己 的后台 执行 post 请求 提交数据 
  //   ```json
  //   encryptedData,rawData,iv,signature code
  //   ```
  // 4. 将`token`和用户数据 `userInfo`存入本地存储
  async getUserInfo(e) {
    // 成功
    try {
      // console.log(e);
      const { userInfo, signature, rawData, iv, encryptedData } = e.detail
      const { code } = await wx.login();
      const { token } = await axios({
        method: 'post',
        url: '/users/wxlogin',
        data: {
          signature, rawData, iv, encryptedData, code
        }
      })
      // 存储 userInfo 到本地
      wx.setStorageSync('userInfo', userInfo);
      // 存储 token 到本地
      wx.setStorageSync('token', token);

      // 登录成功返回到上一个页面
      wx.navigateBack({
        delta: 1
      });

    } catch (error) {
      // 失败
      wx.showToast({
        title: '授权失败,请重试',
        icon: 'none'
      });
    }
  }
})