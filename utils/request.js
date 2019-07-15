const request = obj => {
  // 抽离项目基本路径
  const baseURL = "https://api.zbztb.cn/api/public/v1/";

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