// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      "http://img2.imgtn.bdimg.com/it/u=1353877914,2272011194&fm=26&gp=0.jpg",
      "http://img1.imgtn.bdimg.com/it/u=1458888286,673355229&fm=26&gp=0.jpg",
      "http://img2.imgtn.bdimg.com/it/u=2133019295,1525250475&fm=26&gp=0.jpg"
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //调用获取轮播图数据的方法
    this.getCarouselData();
  },

  //获取轮播图数据
  getCarouselData(){
    wx.request({
      url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
      success: res =>{
        let { message } = res.data;
        this.setData({
          list: message
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