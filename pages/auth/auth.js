const { request } = require("../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 点击登录授权按钮触发的事件
  getUserInfo(e){
    // 1. 获取用户信息
    const {
      encryptedData,
      iv,
      rawData,
      signature
    } = e.detail;

    // 2. 执行微信登录，获取 code
    wx.login({
      success: res => {
        const { code } = res;

        // 组装请求参数
        const params = {
          encryptedData,
          iv,
          rawData,
          signature,
          code
        }

        // 调用获取 token 的请求
        this.getTokenData(params);
      }
    })
  },

  // 登录获取 token 的封装
  getTokenData(params){
    request({
      url: 'users/wxlogin',
      // 登录接口请求方式为 POST
      method: 'POST',
      // 请求参数
      data: {
        ...params
      }
    }).then( res => {
      let token ;

      if(res){
        token = res.token;
      }

      // 把 token 添加到本地存储中
      wx.setStorageSync('token', token);
      // 回退上一页
      wx.navigateBack();
    })
  }
})