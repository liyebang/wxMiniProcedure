const { request } = require("../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 页面参数关键字
    keyword: "",
    // 导航菜单索引
    navindex: 0,
    // 渲染的商品列表
    goodslist:[],
    // 页面参数分类id
    cid: 0,
    // 页面参数页数
    pagenum: 1,
    // 页面参数每页长度
    pagesize: 20,
    //数据总条数
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { keyword, cid } = options;
    this.setData({ keyword, cid });
    // request({ url: "goods/search", data: { query: keyword,cid } })
    // .then( res =>{
    //   let { goods } = res;
    //   this.setData({ goodslist: goods });
    // })
    this.getListData({
      query: keyword,
      cid,
      pagenum: this.data.pagenum,
      pagesize: this.data.pagesize
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
    this.setData({
      navindex: 0,
      goodslist: [],
      pagenum: 1,
      pagesize: 20,
      total: 0
    })

    let { keyword, cid, pagenum, pagesize } = this.data;

    this.getListData({
      query: keyword,
      cid,
      pagenum,
      pagesize
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log(this.data.total, this.data.goodslist.length)
    let { keyword, cid, pagenum, pagesize } = this.data;
    if (this.data.total === this.data.goodslist.length){
      // 弹出提醒
      wx.showToast({
        title: "没有更多商品了",
        // 删除提醒前面的图标
        icon: "none"
      })
      return;
    }
    pagenum++;
    this.setData({ pagenum });
    this.getListData({
      query: keyword,
      cid,
      pagenum,
      pagesize
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 获取商品列表的方法
  getListData(data){
    request({ url: "goods/search", data})
    .then(res => {
      let { goods, total } = res;
      this.setData({ goodslist: [...this.data.goodslist, ...goods], total });
      // 停止下拉动画
      wx.stopPullDownRefresh()
    })
  }
})