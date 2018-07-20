var network = require("./../../../lib/http.js");
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    company:true,
    companyCase:false,
    recommend: true,
    recommendCase: false,
    list:''
  },
  call:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.list.tels 
    })
  },
  shopCase:function(event){
    let id = event.currentTarget.id;
    let productName = this.data.list.productList[id].productName
    let productId = this.data.list.productList[id].productId
    wx.navigateTo({
      url: '../caseDetails/caseDetails?productName=' + productName + '&productId=' + productId
    })  
  },
  recommendCase: function (event){
    let id = event.currentTarget.id;
    let productName = this.data.list.recommendProductList[id].productName
    let productId = this.data.list.recommendProductList[id].productId
    wx.navigateTo({
      url: '../caseDetails/caseDetails?productName=' + productName + '&productId=' + productId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
    that.setData({
      name: options.name//options为页面路由过程中传递的参数
    });
    wx.setNavigationBarTitle({
      title: that.data.name//页面标题为路由参数
    });
    let params = {
      pageCurrent:1,
      pageSize:10,
      companyId: options.companyId
    }
    network.getData("product/getCompanyInfo", params, function (res) {
      if (res.data.object.productList == null){
        that.setData({
          company: false,
          companyCase: true,
        })
      }
      if (res.data.object.recommendProductList == null){
        that.setData({
          recommend: false,
          recommendCase: true,
        })
      }
      if (res.data.object.intro == null) {
        res.data.object.intro = '该公司暂时未填写概况'
      }
      if (res.data.object.commentsNums == null) {
        res.data.object.commentsNums = '0'
      }
      that.setData({
        list: res.data.object
      })
      wx.hideLoading()
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