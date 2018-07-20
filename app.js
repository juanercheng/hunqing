//app.js
var network = require("./lib/http.js");

  
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var params = {
          js_code: res.code
        };
        var that = this;
        network.postData("minePrem/loginByWxJSCode", params, function (res) {
          console.log(res)
          var data = res.data.object;
          that.globalData.openid = data.openid;
          that.globalData.session_key = data.session_key;
          that.globalData.token = data.token;
        });
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    token:'9635d403-98f6-4374-ad82-9765e94b4ef9',
    session_key:'',
    openid:''
  }
})