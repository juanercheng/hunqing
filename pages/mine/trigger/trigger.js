var network = require("./../../../lib/http.js");
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  getPhoneNumber: function (e) {
    var that = this
    console.log(e)
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      var encryptedData = encodeURIComponent(encodeURIComponent(e.detail.encryptedData))
      var iv = encodeURIComponent(encodeURIComponent(e.detail.iv))
      var weiXinSessionKey = encodeURIComponent(encodeURIComponent(app.globalData.session_key))
      // var encryptedData = encodeURIComponent(e.detail.encryptedData)
      // var iv = encodeURIComponent(e.detail.iv)
      // var weiXinSessionKey = encodeURIComponent(app.globalData.session_key)
      var params = {
        encryptedData: encryptedData,
        iv: iv,
        weiXinSessionKey: weiXinSessionKey
      }
      // var params = { 
      //   encryptedData: e.detail.encryptedData,
      //   iv: e.detail.iv,
      //   weiXinSessionKey: app.globalData.session_key
      // }

      network.postData("minePrem/loginByWxEncryptedData", params, function (res) {
        console.log(res)
        wx.redirectTo({
          url: '../login/login?phone=' + res.data.object.phoneNumber
        })
        that.setData({
          // login: false,
          phone: res.data.object.phoneNumber
        })
      })
    }
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