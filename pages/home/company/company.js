var network = require("./../../../lib/http.js");
const app = getApp() 


Page({ 
 
  /**
   * 页面的初始数据
   */
  data: {
    list:'',
    hello:true,
    world:false,
    pageCurrent:1,
    pageSize:3,
    isHideLoadMore:false,
    isHideNoMore:false,
    companyName:''
  },
  focusBind:function(){
    this.setData({
      hello: false,
      world: true
    })
  },
  lost:function(){
    this.setData({
      hello: true,
      world: false
    })
  },
  searchText:function(event){
    console.log(event.detail.value);
    this.setData({
      companyName: event.detail.value,
      pageCurrent:1
    })
    var params = {
      pageCurrent: 1,
      pageSize: this.data.pageSize,
      companyName: event.detail.value
    }
    
    var that = this
    network.getData("product/getCompanyList", params, function (res) {
      console.log(res.data.object)
      that.setData({
        list: res.data.object
      })
    })
  },
  listCompany:function(event){
    let id = event.currentTarget.id;
    let name = this.data.list[id].companyName
        id = this.data.list[id].companyId
    wx.navigateTo({
      url: '../companyDetails/companyDetails?name=' + name + '&companyId=' + id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      name: options.name//options为页面路由过程中传递的参数
    })
    wx.setNavigationBarTitle({
      title: that.data.name//页面标题为路由参数
    })
    var params = {
      pageCurrent: this.data.pageCurrent,
      pageSize: this.data.pageSize
    }
    network.getData("product/getCompanyList", params, function (res) {
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
    if (that.data.pageCurrent * 3 == that.data.list.length) {
      var pageCurrent = that.data.pageCurrent + 1;
      var pageSize = that.data.pageSize;
      let oldList = that.data.list;
      var params = {
        pageCurrent: pageCurrent,
        pageSize: pageSize,
        companyName: that.data.companyName
      };
      network.getData("product/getCompanyList", params, function (res) {
        console.log(res.data.object)
        let list = res.data.object

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