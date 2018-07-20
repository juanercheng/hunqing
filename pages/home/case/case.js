var network = require("./../../../lib/http.js");
const app = getApp() 


Page({

  /**
   * 页面的初始数据 
   */
  data: {
    list:'',
    pageSize:10,
    pageCurrent:1,
    isHideLoadMore: false,
    isHideNoMore: false,
    colorHot:'black',
    colorPrice: 'black',
    productName:'',
    imagesHot:[
      './../../../images/home/blackUp.png',
      './../../../images/home/blackDown.png'
    ],
    boolHot:true,
    imagesPrice:[
      './../../../images/home/blackUp.png',
      './../../../images/home/blackDown.png'
    ],
    boolPrice: true,
    sort: "default"
  },
  list:function(event){
    console.log(event)
    var index = Number(event.currentTarget.id);
    var productId = this.data.list[index].productId;
    var productName = this.data.list[index].productName;
    console.log(index, productId, productName)
    wx.navigateTo({
      url: '../caseDetails/caseDetails?productId=' + productId + '&productName=' + productName
    })
  },
  hot:function(){
    
    var params = {
      pageCurrent:1,
      pageSize: this.data.pageSize,
      categoryId: this.data.categoryId
    }
    if (this.data.companyName == undefined){
      params.productName = ''
    }else{
      params.productName = this.data.companyName
    }
    if(this.data.boolHot){
      params.sort = 'ordersCount_asc';
      this.setData({
        boolPrice: true,
        imagesHot: [
          './../../../images/home/blueUp.png',
          './../../../images/home/blackDown.png'
        ],
        imagesPrice: [
          './../../../images/home/blackUp.png',
          './../../../images/home/blackDown.png'
        ],
        boolHot: !this.data.boolHot,
        colorHot: '#236093',
        colorPrice: 'black',
        sort: params.sort
      });
      
    }else{
      params.sort = 'ordersCount_desc';
      this.setData({
        boolPrice: true,
        imagesHot: [
          './../../../images/home/blackUp.png',
          './../../../images/home/blueDown.png'
        ],
        imagesPrice: [
          './../../../images/home/blackUp.png',
          './../../../images/home/blackDown.png'
        ],
        boolHot: !this.data.boolHot,
        colorHot: '#236093',
        colorPrice: 'black',
        sort: params.sort
      })
    }
    console.log(params)
    var that = this;
    network.getData("product/getProductList", params, function (res) {
      console.log(res.data.object)
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
      that.setData({
        list: res.data.object.list,
        sort: params.sort,
        pageCurrent: 1
      })
    });
  },
  price: function () {
    
    var params = {
      pageCurrent: 1,
      pageSize: this.data.pageSize,
      categoryId: this.data.categoryId
    }
    if (this.data.companyName == undefined) {
      params.productName = ''
    } else {
      params.productName = this.data.companyName
    }
    if (this.data.boolPrice) {
      params.sort = 'priceTotal_asc';
      this.setData({
        boolHot: true,
        imagesPrice: [
          './../../../images/home/blueUp.png',
          './../../../images/home/blackDown.png'
        ],
        imagesHot: [
          './../../../images/home/blackUp.png',
          './../../../images/home/blackDown.png'
        ],
        boolPrice: !this.data.boolPrice,
        colorHot: 'black',
        colorPrice: '#236093',
        sort:params.sort
      })
    } else {
      params.sort = 'priceTotal_desc';
      this.setData({
        boolHot: true,
        imagesPrice: [
          './../../../images/home/blackUp.png',
          './../../../images/home/blueDown.png'
        ],
        imagesHot: [
          './../../../images/home/blackUp.png',
          './../../../images/home/blackDown.png'
        ],
        boolPrice: !this.data.boolPrice,
        colorHot: 'black',
        colorPrice: '#236093',
        sort:params.sort
      })
    }

    var that = this;
    network.getData("product/getProductList", params, function (res) {
      console.log(res.data.object)
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
      that.setData({
        list: res.data.object.list,
        sort: params.sort,
        pageCurrent: 1
      })
    });
  },
  zero:function(){
    this.setData({
      colorHot: 'black',
      colorPrice: 'black',
      imagesHot: [
        './../../../images/home/blackUp.png',
        './../../../images/home/blackDown.png'
      ],
      boolHot: true,
      imagesPrice: [
        './../../../images/home/blackUp.png',
        './../../../images/home/blackDown.png'
      ],
      boolPrice: true,
      pageCurrent:1,
      sort:"default"
    })
  },
  searchText:function(event){
    console.log(event.detail.value)
    this.setData({
      companyName: event.detail.value,
      pageCurrent: 1,
      sort: 'default'
    })
    this.setData({
      productName: event.detail.value
    })
    var that = this
    var params = {
      pageCurrent: 1,
      pageSize: this.data.pageSize,
      productName: event.detail.value,
      sort:'default',
      categoryId: that.data.categoryId
    }
    network.getData("product/getProductList", params, function (res) {
      console.log(res.data.object)
      that.setData({
        list: res.data.object.list
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    that.setData({
      name: options.categoryName,//options为页面路由过程中传递的参数
      categoryId: options.categoryId
    })
    wx.setNavigationBarTitle({
      title: that.data.name//页面标题为路由参数
    })
    var params = {
      categoryId: options.categoryId,
      sort:'default',
      pageCurrent:1,

      pageSize:10
    }
    network.getData("product/getProductList", params, function (res) {
      that.setData({
        list: res.data.object.list
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
    if (that.data.pageCurrent * 10 == that.data.list.length) {
      var pageCurrent = that.data.pageCurrent + 1;
      var pageSize = that.data.pageSize;
      let oldList = that.data.list;
      var params = {
        pageCurrent: pageCurrent,
        pageSize: pageSize,
        rollBackTitle:that.data.name,
        sort:that.data.sort
      };
      network.getData("product/getProductList", params, function (res) {
        console.log(res.data.object)
        console.log(res)
        let list = res.data.object.list

        list.map(function (value, index) {
          oldList.push(value)
        })
        that.setData({
          list: oldList,
          isHideLoadMore: false,
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
  onShareAppMessage: function () {
    
  }
})