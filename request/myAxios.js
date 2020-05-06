// 基准路径
const baseURL = 'https://api-hmugo-web.itheima.net/api/public/v1'
// export 导出,暴露   params 参数
export const axios = (params) => {
    // 创建请求拦截
    // 检测请求路径是否含有 /my/  -1  没有 ,大于-1 存在
    if (params.url.indexOf('/my/') > -1) {
        // 获取本地 token 
        const token = wx.getStorageSync('token');
        // 不存在则跳转到授权页面
        if (!token) {
            wx.navigateTo({
                url: '/pages/auth/index',
            });
        } else {
            // 存在，则请求参数中添加（token） header Authorization: token
            params.header = {
                Authorization: token
            }
        }
    }
    return new Promise((resolve, reject) => {
        wx.request({
            // 解构所有参数
            ...params,
            // 基准路径加上请求路径
            url: baseURL + params.url,
            // 成功
            success: (res) => {
                // 成功后的回调函数
                resolve(res.data.message)
            },
            // 失败
            fail: (err) => {
                // 失败后的回调函数
                reject(err)
            }
        })
    })
}