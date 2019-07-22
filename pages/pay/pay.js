// 小程序使用 async await 语法的时候，会报错，解决办法：引入 regeneratorRuntime 包
const regeneratorRuntime = require("../../lib/runtime/runtime.js");

const { request } = require("../../utils/request.js");

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

  },

  // 点击结算
  async handlePay(){
    
    // 1. 先检验本地有没有 token，没有 token 就跳转到登录授权
    // const token = wx.getStorageSync("token");

    // if (!token){
    //   wx.navigateTo({
    //     url: '/pages/auth/auth',
    //   });
    //   // 没有授权就退出函数
    //   return;
    // }
    // 已经封装到请求函数里面

    // 支付流程 - 要按顺序执行 - 如何从上往下执行 - 可以封装成方法，内部返回 Promise 对象

    const {
      cartlist,
      address,
      total
    } = this.data;

    // 创建用于创建订单的商品对象
    const goods =
      // 遍历购物车集合的 keys
      Object.keys(cartlist)
        // filter 过滤选中状态的商品
        .filter(id => cartlist[id].selected)
        // map 返回新对象，用于创建订单
        .map(id => {
          return {
            goods_id: cartlist[id].goods_id,
            goods_price: +cartlist[id].goods_price,
            goods_number: cartlist[id].count
          }
        });

    // 创建订单
    const params = {
      "order_price": total,
      "consignee_addr": address.addressInfo,
      "goods": goods
    }

    try{
      // 1. 创建订单，获取订单编号
      const {
        order_number
      } = (await this.getOrderNumber(params));
      // console.log(order_number, '1. 创建订单，获取订单编号');
      // 2. 根据订单编号，准备预支付
      const { pay } = await this.getPrePay(order_number);
      console.log(pay, "2. 根据订单编号，准备预支付");
      // 3. 根据预支付数据发起微信支付
      const res = await this.getRequestPayment(pay);
      console.log(res, "3. 根据预支付数据发起微信支付");
      // 4. 微信支付成功后，查询订单，更新订单状态
      const res2 = await this.getOrderCheck(order_number);
      console.log(res2, '4. 微信支付成功后，查询订单，更新订单状态');

      // try 如果走到最后，说明支付成功，提示用户
      wx.showToast({
        title: "支付成功"
      });

      // 删除本地存储选中的商品的数据
      // 获取 cartList 所有键名称，也就是 id
      Object.keys(cartlist)
        // 过滤购物车数据中，选中状态商品的 id 值
        .filter(id => cartlist[id].selected)
        // 遍历选中状态 id 值，从购物车数据中删除。
        .forEach(id => {
          delete cartlist[id]
        });

      // 把新的购物车数据更新到本地存储
      wx.setStorageSync('cartlist', cartlist);

      wx.redirectTo({
        url: "/pages/order/order?type=3"
      });
    }catch(err){
      console.log('捕获报错信息', err);
      wx.showToast({
        title: '支付失败',
        icon: 'none'
      });
    }

  },

  // 1.创建订单，获取订单编号
  getOrderNumber(params) {
    // 获取 token 
    const token = wx.getStorageSync('token');
    // 调用接口，需要带上 token
    return request({
      url: 'my/orders/create',
      method: "POST",
      // 请求头带上 token
      header: {
        "Authorization": token
      },
      data: {
        ...params
      }
    })
  },

  // 2. 根据订单编号，准备预支付
  getPrePay(order_number){
    return request({
      url: 'my/orders/req_unifiedorder',
      method: "POST",
      data:{
        order_number
      }
    })
  },

  // 3. 根据预支付数据发起微信支付
  getRequestPayment(pay){
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        ...pay,
        success: (res) => {
          resolve(res)
        },
        fail: (res) => {
          reject(res)
        }
      })
    })
  },

  // 4. 微信支付成功后，查询订单，更新订单状态
  getOrderCheck(order_number){
    return request({
      url: 'my/orders/chkOrder',
      method: 'POST',
      data: {
        order_number
      }
    })
  }
})