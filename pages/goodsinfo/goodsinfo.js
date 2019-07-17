const { request } = require("../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品的全部信息
    goodsinfo:{},
    // 图片预览需要用到的数组
    urls:[],
    //渲染的富文本字符串
    goods_introduce: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { goods_id } = options;
    request({ url: "goods/detail", data: { goods_id }})
    .then( res => {
      let urls = res.pics.map( (item, index) => {
        return item.pics_big
      })

      // 由于苹果不支持显示webp图片，所以要对富文本字符串进行处理
      let goods_introduce = res.goods_introduce.replace(/\?.+?webp/g, '')

      this.setData({ goodsinfo: res, urls, goods_introduce })
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

  },

  // 点击轮播图预览图片
  previewImg(e){
    let { current } = e.currentTarget.dataset;

    // 图片预览
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: this.data.urls // 需要预览的图片http链接列表
    })
  },

  // 加入购物车
  addToCart(){
    const { goods_id, goods_small_logo, goods_name, goods_price } = this.data.goodsinfo;

    // 先获取本地存储的购物车数据
    let cartlist = wx.getStorageSync("cartlist") || {};

    // 如果购物车之间没有添加过这个商品，就增加这个商品，并加上数量以及选中状态
    if (Object.keys(cartlist).indexOf(`${goods_id}`) === -1 ){
      let goodsitem = {
        goods_id,
        goods_small_logo,
        goods_name,
        goods_price,
        selected: true,
        count: 1
      }

      // 把 goods_id 作为键名称存放购物车总商品关键信息
      cartlist[goods_id] = goodsitem;
    }else{
      cartlist[goods_id].count++
    }

    wx.setStorageSync('cartlist', cartlist);
  }
})