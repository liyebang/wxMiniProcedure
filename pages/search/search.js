const { request } = require("../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索框的内容
    serachIpunt:'',
    // 历史搜索列表内容
    historylist:[],
    // 输入内容时提示的内容
    tipslist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { keyword } = options;
    // 获取本地存储的历史搜索信息，如没有则为空数组
    let historylist = wx.getStorageSync("historylist") || [];
    this.setData({ serachIpunt: keyword, historylist });
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

  // 用户在输入框输入时触发
  serachIpuntChange(e){
    let { value } = e.detail;
    this.setData({ serachIpunt: value })

    if(this.data.serachIpunt !== ''){
      request({ url: "goods/qsearch", data: { query: this.data.serachIpunt } })
      .then( res => {
        this.setData({ tipslist: res })
      })
    }

  },

  // 用户确认搜索
  inputSumbit(){
    if (this.data.serachIpunt === ""){
      wx.showToast({
        title: '输入不能为空',
        icon: "none"
      })
      return;
    }

    let { historylist } = this.data;

    historylist.unshift(this.data.serachIpunt);

    this.setData({
      historylist: [...new Set(historylist)]
    })

    // 保存到本地
    wx.setStorageSync("historylist", this.data.historylist);
  },

  // 清除搜索历史记录
  clearHistory(){
    wx.showModal({
      title: '提示',
      content: '是否确认删除所有历史搜索记录',
      success: res =>{
        if (res.confirm === true){
          this.setData({ historylist: [] })

          // 清空本地缓存
          wx.removeStorageSync("historylist")
        }
      }
    })
  }
})