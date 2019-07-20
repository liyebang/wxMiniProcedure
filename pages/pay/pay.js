// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {
      userName: '',
      telNumber: '',
      addressInfo: ''
    },
    // 购物车列表
    cartlist: {},
    // 价格总计
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cartlist = wx.getStorageSync('cartlist'), total = 0;

    Object.values(cartlist).forEach( item =>{
      if (item.selected){
        total += (item.count * item.goods_price)
      }
    });

    this.setData({
      address: wx.getStorageSync('address') || {},
      cartlist,
      total
    })
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

  }
})