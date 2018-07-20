var network = require("./../../../lib/http.js");
const app = getApp() 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    detailHave:true,
    detailNull:false
  },
  big:function(){
    var imgBanner = this.data.content.imgBanner;
    wx.previewImage({
      current: this.data.content.imgBanner[0],
      urls: imgBanner
    })
  },
  reserve:function(){
    let productId = this.data.content.productId;
    console.log(app.globalData.token)
    // if (app.globalData.token == ''){
    //   wx.navigateTo({
    //     url: '/pages/mine/trigger/trigger'
    //   })
    // }else{
      wx.navigateTo({
        url: '../confirm/confirm?productId=' + productId
      })
    // }
    
  },
  shop:function(){
    let name = this.data.content.companyName
    let companyId = this.data.content.companyId
    wx.navigateTo({
      url: '../companyDetails/companyDetails?name=' + name + '&companyId=' + companyId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    that.setData({
      name: options.productName//options为页面路由过程中传递的参数
    })
    wx.setNavigationBarTitle({
      title: that.data.name//页面标题为路由参数
    })
    var params = {
      productId : options.productId
    }
    console.log(params)
    network.getData("product/getProductInfo", params, function (res) {
      console.log(res.data.object)
      if (res.data.object.detail == null) {
          that.setData({
            detailHave: false,
            detailNull: true
          })
      }
      var imgBanner = res.data.object.imgBanner

      res.data.object.imgBanner = imgBanner.split(',')
      console.log(res.data.object.imgBanner)
      that.setData({
        content: res.data.object
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