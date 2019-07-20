// components/address/address.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    address:{
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取收货地址
    chooseAddress() {
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
          if (addressAuth === undefined || addressAuth === true) {
            this.chooseAddressMain();
            // 用户点击了取消的情况
          } else if (addressAuth === false) {
            // 弹出设置界面
            wx.openSetting({
              success: res => {
                // 设置界面点击返回后触发 success 回调函数，再尝试调用收货地址
                this.chooseAddressMain();
              }
            })
          }
        }
      })
    },

    // 选择收货地址的核心函数
    chooseAddressMain() {
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

          const address = {
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
  }
})
