var network = require("./../../../lib/http.js");
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    orderNo: '',
    productId: ''
  },
  reservation:function(){
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '是否取消预定？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
            mask: true
          })
          let params = {
            orderNo: that.data.orderNo,
            token: app.globalData.token
          }
          wx.request({
            url: network.http + 'busorder/cancelOrder?orderNo=' + params.orderNo + '&token=' + params.token,
            header: {
              'Content-Type': 'application/ json;charset=UTF - 8;'
            },
            method: "PUT",
            success: function (res) {
              wx.hideLoading()
              console.log(res)
              wx.reLaunch({
                url: '/pages/weddingCenter/weddingCenter/weddingCenter'
              });
            },
            fail: function (res) {
              console.log(res)
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  pay: function () {
    wx.navigateTo({
      url: '/pages/home/confirm/confirm?productId=' + this.data.productId
    })
  },
  refundMoney: function () {
    wx.navigateTo({
      url: '../applicationRefund/applicationRefund?orderNo=' + this.data.orderNo
    })
  },
  comment: function () {
    wx.navigateTo({
      url: '../comment/comment?orderNo=' + this.data.orderNo
    })
  },
  circle: function () {
    wx.navigateTo({
      url: '/pages/newCircle/release/release?orderNo=' + this.data.orderNo
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    var that = this;
    let params = {
      orderNo: options.orderNo,
      token: app.globalData.token
    } 
    network.getData("busorder/getOrderDetail", params, function (res) {
      console.log(res)
      // console.log(res.data.object)
      // console.log(res.data.object)
      that.setData({
        content: res.data.object,
        orderNo: res.data.object.orderNo,
        productId: res.data.object.productId
      })
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