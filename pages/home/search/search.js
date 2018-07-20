var network = require("./../../../lib/http.js");
const app = getApp()



Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageCurrent: 1,
    pageSize: 3,
    busCompanyList: null,
    busProductList: null,
    companyPageCurrent: 1,
    casePageCurrent: 1,
    companyMore: true,
    companyNoMore: false,
    caseMore: true,
    caseNoMore: false,
  },
  more: function(event) {
    console.log(event.currentTarget.id)
    if (event.currentTarget.id == 'company') {
      var content = {};
      content.pageCurrent = this.data.companyPageCurrent + 1;
      content.pageSize = this.data.pageSize;
      content.content = event.currentTarget.id;
      content.value = this.data.value;
      this.setData({
        companyPageCurrent: content.pageCurrent,
      })
      this.searchNet(content)
    } else {
      var content = {};
      content.pageCurrent = this.data.casePageCurrent + 1;
      content.pageSize = this.data.pageSize;
      content.content = event.currentTarget.id;
      content.value = this.data.value;
      this.setData({
        casePageCurrent: content.pageCurrent,
      })
      this.searchNet(content)
    }
  },
  searchText: function(event) {
    console.log(event.detail.value);
    // if (event.detail.value == ''){
    //   this.setData({
    //     busCompanyList: [],
    //     busProductList: []
    //   })
    // }else{
    this.setData({
      value: event.detail.value,
      casePageCurrent: 1,
      companyPageCurrent: 1,
      companyMore: true,
      companyNoMore: false,
      caseMore: true,
      caseNoMore: false,
    });
    var content = {};
    content.value = event.detail.value;
    content.pageCurrent = this.data.pageCurrent;
    content.pageSize = this.data.pageSize;
    this.searchNet(content);
    // }

  },
  searchNet: function(content) {
    console.log(content.value)
    if (content.value == undefined) {
      var params = {
        pageCurrent: content.pageCurrent,
        pageSize: content.pageSize,
        value: ''
      }
    } else {
    var params = {
      pageCurrent: content.pageCurrent,
      pageSize: content.pageSize,
      value: content.value
    }
    }
    var that = this;
    network.getData("product/search", params, function(res) {
      console.log(res)
      // if (res.data.code !== 500) {
      var busCompanyList = res.data.object.busCompanyList;
      var busProductList = res.data.object.busProductList;
      if (content.content == 'company') {
        if (busCompanyList.length == 0) {
          that.setData({
            companyMore: false,
            companyNoMore: true,
          })
        } else {
          var busCompanyList = res.data.object.busCompanyList;
          var list = that.data.busCompanyList;
          busCompanyList.map(function(value, index) {
            list.push(value);
          })
          that.setData({
            busCompanyList: list
          })
        }
      } else if (content.content == 'case') {
        if (busProductList.length == 0) {
          that.setData({
            caseMore: false,
            caseNoMore: true,
          })
        } else {
          var busProductList = res.data.object.busProductList;
          var list = that.data.busProductList;
          busProductList.map(function(value, index) {
            list.push(value);
          })
          that.setData({
            busProductList: list
          })
        }
      } else {
        // if (that.data.value == ''){
        //   that.setData({
        //     busCompanyList: [],
        //     busProductList: []
        //   })
        // }else{
        that.setData({
          busCompanyList: busCompanyList,
          busProductList: busProductList
        })
        // }

      }
      // } 
      // else {
      //   that.setData({
      //     busCompanyList: [],
      //     busProductList: []
      //   })
      // }
    })
  },
  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function(options) {
    var params = {
      pageCurrent: 1,
      pageSize: 3,
      value: ''
    }
    var that = this
    network.getData("product/search", params, function(res) {
      console.log(res)
      var busCompanyList = res.data.object.busCompanyList;
      var busProductList = res.data.object.busProductList;
      that.setData({
        busCompanyList: busCompanyList,
        busProductList: busProductList
      })
    })
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