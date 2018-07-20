var network = require("./../../../lib/http.js");
var CryptoJS = require('./../../../crypto-js/crypto-js.js');
const app = getApp()

function encryptByDES(message, key) {
  var keyHex = CryptoJS.enc.Utf8.parse(key);
  var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: ''
  },
  msg: function (event) {
    console.log(event.detail.value)
    this.setData({
      msg: event.detail.value
    })
  },
  codeMsg: function () {
    var mobileEncrypt = encodeURIComponent(encryptByDES(this.data.phone, 'mdi1f84h60gj68e3hdkgt74gg13``》《《《《*&&*****./,..,y'))
    var params = {
      type: 5,
      mobile: this.data.phone,
      mobileEncrypt: mobileEncrypt
    }
    var that = this;
    network.postData("user/getMobileCode", params, function (res) {
      console.log(res)
      var JSESSIONID = wx.getStorageSync("sessionid")
      JSESSIONID = JSESSIONID.split(';')
      JSESSIONID = JSESSIONID[0].split('=')
      JSESSIONID = JSESSIONID[1]
      console.log()
      that.setData({
        sessionid: JSESSIONID
      })
    })
  },
  other: function () {
    wx.redirectTo({
      url: '../other/other'
    })
  },
  loginNow: function () {
    wx.showLoading({
      title: '加载中',
    })
    var weiXinOpenId = encodeURIComponent(app.globalData.openid)
    var weiXinSessionKey = encodeURIComponent(app.globalData.session_key)
    var params = {
      mobile: this.data.phone,
      msgcode: this.data.msg,
      weiXinOpenId: app.globalData.openid,
      weiXinSessionKey: app.globalData.session_key,
      JSESSIONID: this.data.sessionid,
      type: 1
    }
    var that = this;
    wx.request({
      url: network.http + 'user/register?mobile=' + params.mobile + '&msgcode=' + params.msgcode + '&weiXinOpenId=' + params.weiXinOpenId + '&weiXinSessionKey=' + params.weiXinSessionKey + 'type=1',
      header: {
        'Content-Type': 'application/ json;charset=UTF - 8;',
        'Cookie': 'JSESSIONID=' + this.data.sessionid
      },
      method: "POST",
      success: function (res) {
        console.log(res)
        network.getData("userInfo/getUserInfo", token, function (res) {
          console.log(res.data.object.token)
          app.globalData.token = res.data.object.token
          var status = res.data.object.status;
          if (status === 2) {
            wx.navigateBack({
              delta: 1
            })
          }else{
            wx.redirectTo({
              url: '../personal/personal'
            })
          }
          wx.hideLoading()
        })
      },
      fail: function (res) {
        console.log(res)
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: options.phone
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