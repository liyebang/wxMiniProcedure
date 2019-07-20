// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 收货信息
    address:{
      userName: '',
      telNumber: '',
      addressInfo: ''
    },
    // 购物车列表
    cartlist:{},
    // 是否全选
    isSelectAll: true,
    // 选中的种类数量
    selectType: 0,
    // 选中的价格合计
    total: 0
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
    this.setData({
      address: wx.getStorageSync('address') || {},
      cartlist: wx.getStorageSync('cartlist') || {},
    })

    // 加载时确定全选按钮是否激活
    if (Object.keys(this.data.cartlist).length !== 0){
      let selectSwitch = true;

      Object.keys(this.data.cartlist).forEach(item => {
        if (this.data.cartlist[item].selected === false) {
          this.setData({ isSelectAll: false })
          selectSwitch = false;
        }
      })

      if (selectSwitch) {
        this.setData({ isSelectAll: true })
      }
    }

    // 加载时计算选择的种类和总价
    let selectType = 0, total = 0;

    Object.keys(this.data.cartlist).forEach(item => {
      if (this.data.cartlist[item].selected === true) {
        selectType += 1;
        total += (this.data.cartlist[item].count * this.data.cartlist[item].goods_price);
      }
    })

    this.setData({ selectType, total })
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

  // 获取收货地址
  chooseAddress(){
    // 把收货地址的功能封装，因为用户可能点击了不授权，需要特殊处理
    // 用户可能点击确定或点击取消
    wx.getSetting({
      success: res => {
        // console.log(res)
        // 在返回值中获取地址的授权情况
        const addressAuth = res.authSetting['scope.address'];
        // addressAuth 主要有三个返回值
        //    undefined    从来没有打开过授权
        //    false        用户在授权弹窗的时候选择了 取消
        //    true         用户在授权弹窗的时候选择了 确定
        //    用户在取消授权后，api 就不能被调用了 - 解决办法是打开授权设置
        if (addressAuth === undefined || addressAuth === true){
          this.chooseAddressMain();
          // 用户点击了取消的情况
        } else if (addressAuth === false){
          // 弹出设置界面
          wx.openSetting({
            success: res =>{
              // 设置界面点击返回后触发 success 回调函数，再尝试调用收货地址
              this.chooseAddressMain();
            }
          })
        }
      }
    })
  },

  // 选择收货地址的核心函数
  chooseAddressMain(){
    // 微信内部原生的收货地址界面，而且所有小程序收货地址信息都是互通的
    wx.chooseAddress({
      success: res => {
        const { 
          userName,
          telNumber,
          provinceName,
          cityName,
          countyName,
          detailInfo 
          } = res;

        const address ={
          userName,
          telNumber,
          addressInfo: provinceName + cityName + countyName + detailInfo
        }

        // 把地址设置到页面中
        this.setData({
          address
        });

        // 保存到本地存储中
        wx.setStorageSync('address', address);
      }
    })
  },

  // 统一修改购物车本地数据和data中的数据
  setNewCartlise(cartlist){
    let selectType = 0, total = 0;

    Object.keys(cartlist).forEach( item => {
      if (cartlist[item].selected === true){
        selectType += 1;
        total += (cartlist[item].count * cartlist[item].goods_price);
      }
    })

    this.setData({ cartlist, selectType, total });
    wx.setStorageSync('cartlist', cartlist)
  },

  // // 跳转到商品详情
  // toGoodsinfo(e){
  //   let { id } = e.currentTarget.dataset;
  //   wx.navigateTo({
  //     url: `/pages/goodsinfo/goodsinfo?goods_id=${id}`,
  //   })
  // },

  // 商品数量加减
  countHandle(e){
    let { id, num } = e.currentTarget.dataset;
    let cartlist = {...this.data.cartlist};
    cartlist[id].count += +num;

    // 如果商品数量为0，询问客户是否需要删除该商品
    if (cartlist[id].count === 0){
      wx.showModal({
        title: '是否需要删除该商品',
        success: res =>{
          if (res.confirm === true){
            delete cartlist[id]
          }
          if (res.cancel === true){
            cartlist[id].count = 1
          }
          this.setNewCartlise(cartlist);
        }
      })
    }

    this.setNewCartlise(cartlist);
  },

  // 点击单个商品选择按钮
  selectOne(e){
    let { id } = e.currentTarget.dataset;
    let cartlist = { ...this.data.cartlist};
    cartlist[id].selected = !cartlist[id].selected;

    // 开关
    let selectSwitch = true;

    Object.keys(cartlist).forEach( item =>{
      if (cartlist[item].selected === false){
        this.setData({ isSelectAll: false })
        selectSwitch = false;
      }
    })

    if (selectSwitch){
      this.setData({ isSelectAll: true })
    }

    this.setNewCartlise(cartlist)
  },

  // 点击全选按钮
  selectAll(){
    if (Object.keys(this.data.cartlist).length === 0){
      return;
    }

    this.setData({ isSelectAll: !this.data.isSelectAll });
    let cartlist = { ...this.data.cartlist };
    Object.keys(cartlist).forEach( item => {
      cartlist[item].selected = this.data.isSelectAll;
    })
    this.setNewCartlise(cartlist)
  },

  // 支付
  toPay(){
    if (!this.data.address.userName){
      wx.showToast({
        title: '请选择收货地址',
        icon: "none",
        duration: 1000
      })
    } else if (this.data.selectType === 0){
      wx.showToast({
        title: '未选择任何商品',
        icon: "none",
        duration: 1000
      })
    }else {
      wx.navigateTo({
        url: '/pages/pay/pay',
      })
    }
  }
})