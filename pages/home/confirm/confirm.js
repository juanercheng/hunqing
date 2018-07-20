var network = require("./../../../lib/http.js");
const app = getApp() 

Page({

  /**
   * 页面的初始数据  
   */
  data: {
    
  },
  pay:function(){
    console.log('支付')
    let params = {
      productId: this.data.content.productId,
      token: app.globalData.token
    }
    network.postData("busorder/buyProduct", params, function (res) {
      console.log(res)
    })
  },
  call:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.content.busCompanyEntity.tels
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let params = {
      productId:options.productId,
      token: app.globalData.token
    }
    network.getData("busorder/buyProduct", params, function (res) {
      console.log(res)
      var content = res.data.object
        that.setData({
          content: content,
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