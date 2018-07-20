var network = require("./../../../lib/http.js");
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    star: [
      './../../../images/weddingCenter/starNull.png',
      './../../../images/weddingCenter/starNull.png',
      './../../../images/weddingCenter/starNull.png',
      './../../../images/weddingCenter/starNull.png',
      './../../../images/weddingCenter/starNull.png',
    ],
    id: null,
    sendDisabled: true
  },
  starBind: function (event) {
    var id = Number(event.currentTarget.id);
    var star = this.data.star;
    if (id + 1 == 5) {
      wx.showModal({
        title: '温馨提示',
        content: '记录一下您喜欢的地方',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    if (id + 1 <= 3){
      wx.showModal({
        title: '温馨提示',
        content: '不够满意？请留下您的宝贵意见',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
      if (star[id] == './../../../images/weddingCenter/starNull.png') {
        for (var i = 0; i <= star.length; i++) {
          if (id >= i) {
            star[i] = './../../../images/weddingCenter/star.png'
          }
        }
        this.setData({
          sendDisabled: false
        })
      } else {
        if (star[1] == './../../../images/weddingCenter/star.png') {
          id = id + 1;
          for (var i = 0; i < star.length; i++) {
            if (i >= id) {
              console.log(id, i, star[i])
              star[i] = './../../../images/weddingCenter/starNull.png'
            }
          }
        } else {
          for (var i = 0; i < star.length; i++) {
            if (i >= id) {
              console.log(id, i, star[i])
              star[i] = './../../../images/weddingCenter/starNull.png'
            }
          }
          this.setData({
            sendDisabled: true
          })
        }
      }
    this.setData({
      star: star,
      id: id
    })

  },
  textarea: function (event) {
    console.log(event.detail.value)
    this.setData({
      text: event.detail.value
    })
  },

  send: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var url = ''
    if (this.data.text == undefined) {
      var params = {
        level: this.data.id + 1,
        orderNo: this.data.orderNo,
        token: app.globalData.token
      };
      url = network.http + 'orderEvaluate/submitCommentOrder?orderNo=' + params.orderNo + '&token=' + params.token + '&level=' + params.level;
    } else {
      var params = {
        level: this.data.id + 1,
        content: this.data.text,
        orderNo: this.data.orderNo,
        token: app.globalData.token
      };
      url = network.http + 'orderEvaluate/submitCommentOrder?orderNo=' + params.orderNo + '&token=' + params.token + '&level=' + params.level + '&content=' + params.content
    }
    console.log(params)
    wx.request({
      url: url,
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
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var params = {
      orderNo: options.orderNo,
      token: app.globalData.token
    };
    var that = this;
    network.getData("orderEvaluate/commentOrder", params, function (res) {
      console.log(res.data.object);
      that.setData({
        content: res.data.object,
        orderNo: res.data.object.orderNo
      });
    });
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