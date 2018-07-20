var network = require("./../../../lib/http.js");
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    hello: '1px #ced3db solid',
    orderNo: '', 
    pageCurrent: 1,
    pageSize: 10,
    isHideLoadMore: false,
    isHideNoMore: false
  },
  //待付款 
  wite: function() { 
    wx.navigateTo({
      url: '../payment/payment?orderStatus=0&name=待付款'
    })
  },
  //已付款
  payment: function() {
    wx.navigateTo({
      url: '../payment/payment?orderStatus=1&name=已付款'
    })
  },
  //已完成
  complete: function() {
    wx.navigateTo({
      url: '../payment/payment?orderStatus=4&name=已完成'
    })
  },
  //退款
  refund: function() {
    wx.navigateTo({
      url: '../payment/payment?orderStatus=100&name=退款'
    })
  },
  reservation: function(event) {
    var index = Number(event.currentTarget.id)
    var orderNo = this.data.orderNo[index].orderNo
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '是否取消预定？',
      success: function(res) {
        if (res.confirm) {
          let params = {
            orderNo: orderNo,
            token: app.globalData.token
          }
          wx.request({
            url: network.http + 'busorder/cancelOrder?orderNo=' + params.orderNo + '&token=' + params.token,
            header: {
              'Content-Type': 'application/ json;charset=UTF - 8;'
            },
            method: "PUT",
            success: function(res) {
              console.log(res)
              that.onLoad()
            },
            fail: function(res) {
              console.log(res)
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  pay:function(event){
    var index = Number(event.currentTarget.id);
    var productId = this.data.orderNo[index].productId;
    wx.navigateTo({
      url: '/pages/home/confirm/confirm?productId=' + productId
    })
  },
  comment: function(event) {
    var index = Number(event.currentTarget.id);
    var orderNo = this.data.orderNo[index].orderNo;
    wx.navigateTo({
      url: '../comment/comment?orderNo=' + orderNo
    })
  },
  circle: function (event) {
    var index = Number(event.currentTarget.id);
    var orderNo = this.data.orderNo[index].orderNo;
    wx.navigateTo({
      url: '/pages/newCircle/release/release?orderNo=' + orderNo
    })
  },
  refundMoney: function (event){
    var index = Number(event.currentTarget.id);
    var orderNo = this.data.orderNo[index].orderNo;
    wx.navigateTo({
      url: '../applicationRefund/applicationRefund?orderNo=' + orderNo
    })
  },
  details: function(event) {
    console.log(event.currentTarget.id)
    var index = Number(event.currentTarget.id)
    var orderNo = this.data.orderNo[index].orderNo
    console.log(orderNo)
    wx.navigateTo({
      url: '../details/details?orderNo=' + orderNo
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
    let params = {
      pageCurrent: that.data.pageCurrent,
      pageSize: that.data.pageSize,
      token: app.globalData.token
    }
    wx.request({
      url: network.http + 'busorder/getMyOrders?pageCurrent=' + params.pageCurrent + '&pageSize=' + params.pageSize + '&token=' + params.token,
      header: {
        'Content-Type': 'application/ json;charset=UTF - 8;'
      },
      method: "GET",
      success:function(res){
        console.log(res)
        if(res.data.code == 101){
          console.log('失效了')
          wx.navigateTo({
            url: '/pages/mine/trigger/trigger'
          })
        }else{
          that.setData({
            orderNo: res.data.object
          })
        }
        wx.hideLoading()
      },
      fail:function(res){
        console.log(res)
      }
    })
    network.getData("busorder/getMyOrders", params, function(res) {
      console.log(res)
      console.log(res.data.object)
      console.log(res.data.object)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    if (app.globalData.phone === null) {
      // wx.navigateTo({
      //   url: "/pages/mine/trigger/trigger"
      // })
    }
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
    var that = this;
    that.setData({
      isHideLoadMore: true
    })
    if (that.data.pageCurrent * 10 == that.data.orderNo.length) {
      var pageCurrent = that.data.pageCurrent + 1;
      var pageSize = that.data.pageSize;
      let orderNo = that.data.orderNo;
      let params = {
        pageCurrent: pageCurrent,
        pageSize: pageSize,
        token: app.globalData.token
      }
      console.log(params)
      network.getData("busorder/getMyOrders", params, function (res) {
        console.log(res)
        console.log(res.data.object)
        console.log(res.data.object)
        let list = res.data.object
        
        list.map(function (value, index) {
          orderNo.push(value)
        })
        that.setData({
          orderNo: orderNo,
          pageCurrent: pageCurrent
        })
      })
    } else {
      that.setData({
        isHideLoadMore: false,
        isHideNoMore: true
      })
      setTimeout(function () {
        that.setData({
          isHideNoMore: false
        })
      }, 3000)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})