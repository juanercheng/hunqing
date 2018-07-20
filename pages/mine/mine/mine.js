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
    loginImages: true,
    loginName: true,
    images: false,
    name: false,
    login: true,
    loginOther: true,
  },
  //授权 
  getPhoneNumber: function(e) {
    console.log(e)
    console.log(app.globalData)
    var that = this;
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

      network.postData("minePrem/loginByWxEncryptedData", params, function(res) {
        console.log(res)
        wx.navigateTo({
          url: '../login/login?phone=' + res.data.object.phoneNumber
        })
        that.setData({
          // login: false,
          phone: res.data.object.phoneNumber
        })
      })
      // that.setData({
        
      //   // loginImages: false,
      //   // loginName: false,
      //   // images: true,
      //   // name: true,
      // })
    }
  },
  codeMsg:function(){
    var mobileEncrypt = encryptByDES(this.data.phone, 'mdi1f84h60gj68e3hdkgt74gg13``》《《《《*&&*****./,..,y')
    var params = {
      type:5,
      mobile: this.data.phone,
      mobileEncrypt: mobileEncrypt
    }
    network.postData("user/getMobileCode", params, function (res) {
      console.log(res)
    })
  },
  msg:function(event){
    console.log(event.detail.value)
    this.setData({
      msg: event.detail.value
    })
  },
  loginNow:function(){
    var params = {
      mobile: this.data.phone,
      msgcode: this.data.msg,
      weiXinOpenId: app.globalData.openid,
      weiXinSessionKey: app.globalData.session_key,
      type:1
    }
    var that = this;
    network.postData("user/register", params, function (res) {
      that.setData({
        login: true,
        loginImages: false,
        loginName: false,
        images: true,
        name: true,
      })
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      })
    })
  },
  //登录
  // login: function() {
    // this.setData({
    //   login: true,
    //   loginImages: false,
    //   loginName: false,
    //   images: true,
    //   name: true,
    // })
  // },
  //下一步
  // next: function() {
    // this.setData({
    //   loginOther: true,
    //   loginImages: false,
    //   loginName: false,
    //   images: true,
    //   name: true,
    // })
  // },
  //其他手机登录
  // other: function() {
  //   this.setData({
  //     login: true,
  //     loginOther: false
      // loginImages: false,
      // loginName: false,
      // images: true,
      // name: true,
  //   })
  // },
  //个人资料
  personal: function() {
    console.log('个人资料')
    wx.navigateTo({
      url: '../personal/personal'
    })
  },
  //私人定制
  customized: function() {
    console.log('私人定制')
    wx.navigateTo({
      url: '../customized/customized'
    })
  },
  //关于我们
  about: function() {
    console.log('关于我们')
    wx.navigateTo({
      url: '../about/about'
    })
  },
  //退出
  signOut: function() {
    // wx.downloadFile({
    //   url: 'http://47.100.34.60/angelogisweb/images/hello.pdf',
    //   success: function(res) {
    //     var filePath = res.tempFilePath
    //     wx.openDocument({
    //       filePath: filePath,
    //       success: function(res) {
    //         console.log('打开文档成功')
    //       }
    //     })
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    var JSESSIONID = 'JSESSIONID=578af638-5a8b-460c-955c-6d4291ab24d1; Path=/hunqing; HttpOnly'
    
    console.log(JSESSIONID)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})