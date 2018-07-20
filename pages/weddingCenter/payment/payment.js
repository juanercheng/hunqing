var network = require("./../../../lib/http.js");
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:'',
    pageCurrent: 1,
    pageSize: 10,
    isHideLoadMore: false,
    isHideNoMore: false
  },
  details: function (event) {
    console.log(event.currentTarget.id)
    var index = Number(event.currentTarget.id)
    var orderNo = this.data.list[index].orderNo
    console.log(orderNo)
    wx.navigateTo({
      url: '../details/details?orderNo=' + orderNo
    })
  }, 
  reservation: function (event) {
    var index = Number(event.currentTarget.id)
    var orderNo = this.data.list[index].orderNo
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '是否取消预定？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
            mask:true
          })
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
            success: function (res) {
              wx.hideLoading()
              console.log(res)
              that.onLoad(that.data.options)
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
  pay: function (event) {
    var index = Number(event.currentTarget.id);
    var productId = this.data.list[index].productId;
    wx.navigateTo({
      url: '/pages/home/confirm/confirm?productId=' + productId
    })
  }, 
  refundMoney: function (event) {
    var index = Number(event.currentTarget.id);
    var orderNo = this.data.list[index].orderNo;
    wx.navigateTo({
      url: '../applicationRefund/applicationRefund?orderNo=' + orderNo
    })
  }, 
  comment: function (event) {
    var index = Number(event.currentTarget.id);
    var orderNo = this.data.list[index].orderNo;
    wx.navigateTo({
      url: '../comment/comment?orderNo=' + orderNo
    })
  }, 
  circle: function (event) {
    var index = Number(event.currentTarget.id);
    var orderNo = this.data.list[index].orderNo;
    wx.navigateTo({
      url: '/pages/newCircle/release/release?orderNo=' + orderNo
    })
  }, 
  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      options: options
    })
    var orderStatus = Number(options.orderStatus)
    var params = {
      orderStatus: orderStatus,
      pageCurrent: this.data.pageCurrent,
      pageSize: this.data.pageSize,
      token: app.globalData.token
    }
    var that = this;
    that.setData({
      name: options.name
    })
    wx.setNavigationBarTitle({
      title: that.data.name
    })
    network.getData("busorder/getMyOrders", params, function (res) {
      console.log(res.data.object)
      that.setData({
        list: res.data.object
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
    var that = this
    that.setData({
      isHideLoadMore: true
    })
    console.log(that.data.pageCurrent * 10 , that.data.list.length)
    if (that.data.pageCurrent * 10 == that.data.list.length) {
      var pageCurrent = that.data.pageCurrent + 1;
      var pageSize = that.data.pageSize;
      let oldList = that.data.list;
      var orderStatus = Number(that.data.options.orderStatus)
      var params = {
        orderStatus: orderStatus,
        pageCurrent: this.data.pageCurrent,
        pageSize: this.data.pageSize,
        token: app.globalData.token
      }
      network.getData("busorder/getMyOrders", params, function (res) {
        console.log(res.data.object)
        let list = res.data.object

        list.map(function (value, index) {
          oldList.push(value)
        })
        that.setData({
          pageCurrent: pageCurrent,
          list: oldList,
          isHideLoadMore: false
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
  onShareAppMessage: function () {
    
  }
})