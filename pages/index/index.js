//index.js
//获取应用实例 
var network = require("./../../lib/http.js")
const app = getApp()

Page({
  data: {
    imgUrls: null, 
    small:[], 
    big:[],
    recommendShop: {},
    pageCurrent: 1,
    pageSize: 3,
    sHideLoadMore: false,
    isHideNoMore: false
  },
  jump:function(event){
    console.log(event.currentTarget.id);
    var index = Number(event.currentTarget.id)
    var jumpImg = this.data.imgUrls[index];
    if (jumpImg.jumptype == 0){
      wx.navigateTo({
        url: '/pages/home/advertisement/advertisement?link=' + jumpImg.jumpurl
      })
    }else{
      wx.navigateTo({
        url: '/pages/home/advertisement/advertisement?content=' + jumpImg.content
      })
    }
  },
  //input
  run: function() {
    wx.navigateTo({
      url: '/pages/home/search/search'
    })
  },
  caseListFirst: function(event) {
    console.log(event.currentTarget.id); 
    var index = Number(event.currentTarget.id);
    var small = this.data.small
    var categoryId = small[index].categoryId
    var categoryName = small[index].categoryName
    console.log(categoryId)
    wx.navigateTo({
      url: '../home/case/case?categoryId=' + categoryId + '&categoryName=' + categoryName
    })
  },
  caseListTwo:function(event){
    console.log(event.currentTarget.id);
    var index = Number(event.currentTarget.id);
    var big = this.data.big;
    var categoryId = big[index].categoryId;
    var categoryName = big[index].categoryName;
    console.log(categoryId)
    wx.navigateTo({
      url: '../home/case/case?categoryId=' + categoryId + '&categoryName=' + categoryName
    })
  },
  //婚庆公司
  company: () => {
    wx.navigateTo({
      url: '../home/company/company?name=婚庆公司'
    })
  },
  //推荐店铺跳转
  recommendShop: () => {
    wx.navigateTo({
      url: '../home/company/company?name=推荐店铺'
    })
  },
  commpany: function(event) {
    let indexId = event.currentTarget.id;
    let company = this.data.recommendShop[indexId];
    let name = company.companyName;
    let companyId = company.companyId;
    wx.navigateTo({
      url: '../home/companyDetails/companyDetails?name=' + name + '&companyId=' + companyId
    })
  },
  //案例详情
  caseDetalis: function(event) {
    console.log(event.currentTarget.dataset.company)
    console.log(event.currentTarget.id)
    let companyId = event.currentTarget.dataset.company
    let indexId = event.currentTarget.id
    let recommendShop = this.data.recommendShop;
    var details = null
    recommendShop.map(function(value, index) {
      if (value.companyId === companyId) {
        details = value.productList[indexId]
      }
    })
    let productName = details.productName;
    let productId = details.productId;
    wx.navigateTo({
      url: '../home/caseDetails/caseDetails?productName=' + productName + '&productId=' + productId
    })
  },
  onLoad: function() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    //banner
    network.getData("product/getBanner", '', function(res) {
      that.setData({
        imgUrls: res.data.object
      })
      var params = {
        pageCurrent:1,
        pageSize:3
      }
      network.getData("product/getBuscategory", params, function (res) {
        console.log(res)
        that.setData({
          small:res.data.object.small,
          big:res.data.object.big
        })
        network.getData("product/getSystemRecommendCompany", params, function (res) {
          console.log(res)
          wx.hideLoading()
          that.setData({
            recommendShop: res.data.object
          })
        })
      })
      
    })
  },
  onReachBottom: function() {
    var that = this
    that.setData({
      isHideLoadMore: true
    })
    if (that.data.pageCurrent * 3 == that.data.recommendShop.length) {
      var pageCurrent = that.data.pageCurrent + 1;
      var pageSize = that.data.pageSize;
      let oldList = that.data.recommendShop;
      var params = {
        pageCurrent: pageCurrent,
        pageSize: pageSize,
      };
      network.getData("product/getSystemRecommendCompany", params, function(res) {
        console.log(res)
        let list = res.data.object

        list.map(function(value, index) {
          oldList.push(value)
        })
        that.setData({
          recommendShop: oldList,
          isHideLoadMore: false,
          pageCurrent: pageCurrent
        })
      })
    } else {
      that.setData({
        isHideLoadMore: false,
        isHideNoMore: true
      })
      setTimeout(function() {
        that.setData({
          isHideNoMore: false
        })
      }, 1000)
    }
  }
})