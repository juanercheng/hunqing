var network = require("./../../../lib/http.js");
const app = getApp()


Page({
  /** 
   * 页面的初始数据
   */
  data: {
    list:'', 
    pageCurrent:1,
    pageSize:10,
    isHideLoadMore: false,
    isHideNoMore:false
  },
  //大大大大大
  big:function(e){
    console.log(e.currentTarget.id)
    console.log(this.data.list)
    var list = this.data.list;
    var photos = ''
    list.map(function(value,index){
      if (value.id == e.currentTarget.id){
        photos = value.photos;
      }
    })
    wx.previewImage({
      current: e.target.dataset.src, 
      urls: photos 
    })
  },
  //跳转到新人圈详情页面
  details: (event)=>{
    var id = event.currentTarget.id
    wx.navigateTo({
      url: '../newCircleDetails/newCircleDetails?id=' + id
    })
  },
  //跳转到发布页面
  release:()=>{
    wx.navigateTo({
      url: '../release/release'
    })
  },
  companyDetails:function(event){
    var index = Number(event.currentTarget.id);
    var list = this.data.list[index]
    wx.navigateTo({
      url: "/pages/home/companyDetails/companyDetails?name=" + list.companyName + '&companyId=' + list.objectCompanyId
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
    var loading = setTimeout(function(){
      wx.hideLoading()
    },10000)
    var that = this;
    var params = {
      pageCurrent: this.data.pageCurrent,
      pageSize: this.data.pageSize
    };
    network.getData("moment/getMomentsList", params, function (res) {
      console.log(res.data.object)
      let list = res.data.object.busMomentsVoList;
      let nowTime = res.data.object.serverTime;
      nowTime = nowTime.replace(/-/g, '/');
      nowTime = new Date(nowTime);
      nowTime = nowTime.getTime()
      list.map(function(value,index){
        var createTime = value.createTime;
        createTime = createTime.replace(/-/g, '/');
        createTime = new Date(createTime);
        createTime = createTime.getTime();
        var timeNow = (nowTime - createTime)/1000;
        if (timeNow - 86400 >= 0){
          value.createTime = value.createTime.split(' ')[0];
        }else{
          var today = Math.ceil(timeNow / 60);
          if (today < 60){
            value.createTime = today + '分钟前'
          }else{
            console.log(today)
            today = Math.ceil(today / 60)
            today.toString()
            value.createTime = today + '小时前'
          }
        }
        if (value.photos !== null){
          value.photos = value.photos.split(',') 
        }
      })
      
      that.setData({
        list:list
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
    var that = this
    that.setData({
      isHideLoadMore:true
    })
    console.log(that.data.pageSize, that.data.list.length)
    if (that.data.pageSize == that.data.list.length){
      var pageCurrent = that.data.pageCurrent ;
      var pageSize = that.data.pageSize + 10;
      console.log(pageSize)
      let oldList = that.data.list;
      var params = {
        pageCurrent: pageCurrent,
        pageSize: pageSize
      };
      network.getData("moment/getMomentsList", params, function (res) {
        let list = res.data.object.busMomentsVoList
        let nowTime = res.data.object.serverTime;
        nowTime = nowTime.replace(/-/g, '/');
        nowTime = new Date(nowTime);
        nowTime = nowTime.getTime()
        list.map(function (value, index) {
          var createTime = value.createTime;
          createTime = createTime.replace(/-/g, '/');
          createTime = new Date(createTime);
          createTime = createTime.getTime();
          var timeNow = (nowTime - createTime) / 1000;
          if (timeNow - 86400 >= 0) {
            value.createTime = value.createTime.split(' ')[0];
          } else {
            var today = Math.ceil(timeNow / 60);
            if (today < 60) {
              value.createTime = today + '分钟以前'
            } else {
              today = Math.ceil(today / 24)
              value.createTime = today + '小时以前'
            }
          }
          if (value.photos !== null) {
            value.photos = value.photos.split(',')
          }
        })
        that.setData({
          list: list,
          isHideLoadMore:false,
          pageSize: pageSize
        }) 
      })
    }else{
      that.setData({
        isHideLoadMore: false,
        isHideNoMore: true
      })
      setTimeout(function(){
        that.setData({
          isHideNoMore: false
        })
      },3000)
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})