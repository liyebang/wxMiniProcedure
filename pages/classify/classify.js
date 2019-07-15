// 引入封装好的发送请求的函数
const { request } = require("../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //分类列表
    classifylist:[],
    //活跃项的索引
    activeIndex: 0,
    //右边分类详情
    infolist:[]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getClassifyData();
  },

  //获取分类列表
  getClassifyData(){
    // wx.request({
    //   url: 'https://api.zbztb.cn/api/public/v1/categories',
    //   success: res => {
    //     let { message } = res.data;
    //     console.log(message);
    //     this.setData({ classifylist: message })
    //   }
    // })
    request({ url: "categories" }).then( res => {
      this.setData({ 
        classifylist: res,
        infolist: res[0].children
      })
    })
  },

  // 切换左边分类
  changeActiveIndex(e){
    let { index } = e.currentTarget.dataset;
    this.setData({
      activeIndex: index,
      infolist: this.data.classifylist[index].children
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