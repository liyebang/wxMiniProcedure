const request = obj => {
  // 抽离项目基本路径
  const baseURL = "https://api.zbztb.cn/api/public/v1/";


  // 判断 url 中是否包含了 my/ 路径，如果包含说明是私有路径
  // 私有路径的特征，请求头带上 token 做用户校验
  if (obj.url.includes('my/')){
    // 获取 token 
    const token = wx.getStorageSync('token');
    if(token){
      // 在参数中添加请求头属性
      obj.header = {
        ...obj.header,
        "Authorization": token
      }
    }else{
      // 跳转到授权登录页面
      console.log('没有 token 跳转到登录授权页');
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      // 没有授权就退出函数，需要返回 Promise 对象，防止外部 then 的时候报错。
      return new Promise(() => { });
    }
  }


  // 通过 Promise 对象，把请求成功和失败的回调函数进行封装
  return new Promise((resolve, reject) => {
    //数据请求之前显示等待页面
    wx.showLoading({
      title: '加载中...',
      // 是否显示透明蒙层，防止触摸穿透
      mask: false
    })

    // 发送请求
    wx.request({
      ...obj,
      url: baseURL + obj.url,
      success: res => {
        let { message } = res.data;
        // 通过 Promise 对象，把请求成功和失败的回调函数进行封装
        resolve(message);
      },
      fail: err => {
        reject(err);
      },
      //请求完成后
      complete: res => {
        wx.hideLoading();
      }
    })
  })
}


// 暴露对象
module.exports = {
  request
}