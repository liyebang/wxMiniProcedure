// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图数据
    carousellist:[],
    //导航栏数据
    navlist:[],
    //推荐楼层数据
    floorlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //调用获取轮播图数据的方法
    this.getCarouselData();
    //调用获取导航栏数据的方法
    this.getNavData();
    //调用获取推荐楼层数据的方法
    this.getFloorData();
  },

  //获取轮播图数据
  getCarouselData(){
    wx.request({
      url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
      success: res =>{
        let { message } = res.data;
        this.setData({
          carousellist: message
        })
      }
    })
  },

  //获取导航栏数据
  getNavData(){
    wx.request({
      url: 'https://api.zbztb.cn/api/public/v1/home/catitems',
      success: res => {
        let { message } = res.data;
        this.setData({
          navlist: message
        })
      }
    })
  },

  //获取推荐楼层数据
  getFloorData(){
    wx.request({
      url: 'https://api.zbztb.cn/api/public/v1/home/floordata',
      success: res => {
        let { message } = res.data;
        console.log(message);
        this.setData({
          floorlist: message
        })
      }
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