var network = require("./../../../lib/http.js");
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    refundReason: '',
    content: ''
  },
  submit: function () {
    if (this.data.refundReason == '') {
      wx.showModal({
        title: '温馨提示',
        content: '请填写退款原因',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) {
          }
        }
      })
    }else{
      var params = {
        orderNo: this.data.content.orderNo,
        refundReason: this.data.refundReason,
        token: app.globalData.token
      }
      wx.showModal({
        title: '温馨提示',
        content: '您确定要退款吗？',
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '加载中',
              mask: true
            })
            wx.request({
              url: network.http + 'busorder/submitRefundMoney?orderNo=' + params.orderNo + '&refundReason=' + params.refundReason + '&token=' + params.token,
              header: {
                'Content-Type': 'application/ json;charset=UTF - 8;'
              },
              method: "PUT",
              success: function (res) {
                wx.hideLoading();
                wx.reLaunch({
                  url: '/pages/weddingCenter/weddingCenter/weddingCenter'
                });
              },
              fail: function (res) {
                console.log(res)
              },
            })
          } else if (res.cancel) {
          }
        }
      })
    }
    
    

  },
  reason: function (event) {
    var value = event.detail.value
    this.setData({
      refundReason: value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.orderNo);
    var params = {
      orderNo: options.orderNo,
      token: app.globalData.token
    }
    var that = this;
    network.getData("busorder/getOrderDetail", params, function (res) {
      console.log(res);
      that.setData({
        content: res.data.object
      });
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