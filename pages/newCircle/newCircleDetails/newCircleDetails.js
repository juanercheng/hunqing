var network = require("./../../../lib/http.js");
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    text:'',
    pageSize:10,
    pageCurrent:1
  },
  big:function(event){
    console.log(event.currentTarget.id)
    var index = Number(event.currentTarget.id)
    var photos = this.data.content.photos;
    wx.previewImage({
      current: this.data.content.photos[index],
      urls: photos
    })
  },
  companyDetails:function(){
    var content = this.data.content;
    wx.navigateTo({
      url: "/pages/home/companyDetails/companyDetails?name=" + content.busCompanyEntity.companyName + '&companyId=' + content.busCompanyEntity.companyId
    })
  },
  send: function() {
    if(this.data.text == ''){
      wx.showToast({
        title: '请填写评论内容',
        icon: 'none',
        duration: 2000
      })
    }else{
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      var params = {
        momentId: this.data.id,
        content: this.data.text,
        type: 2,
        token: app.globalData.token
      };
      var that = this;
      network.postData("moment/addMoment", params, function (res) {
        console.log(res.data.object)
        wx.hideLoading()
        that.setData({
          text:''
        })
        that.onLoad(that.data.options)
      })
    }
  },
  text:function(event){
    console.log(event.detail.value)
    this.setData({
      text: event.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    options.id = Number(options.id)
    var params = {
      id: options.id,
      pageCurrent: this.data.pageCurrent,
      pageSize: this.data.pageSize
    };
    network.postData("moment/getMomentDetail", params, function (res) {
      console.log(res)
      let list = res.data.object.busMomentsVo
      var nowTime = res.data.object.serverTime
      nowTime = nowTime.replace(/-/g, '/');
      nowTime = new Date(nowTime);
      nowTime = nowTime.getTime()
      var createTime = list.createTime;
      createTime = createTime.replace(/-/g, '/');
      createTime = new Date(createTime);
      createTime = createTime.getTime();
      var timeNow = (nowTime - createTime) / 1000;
      if (timeNow - 86400 >= 0) {
        list.createTime = list.createTime.split(' ')[0];
      } else {
        var today = Math.ceil(timeNow / 60);
        if (today < 60) {
          list.createTime = today + '分钟以前'
        } else {
          today = Math.ceil(today / 60)
          list.createTime = today + '小时以前'
        }
      }
      if (list.photos !== null){ 
        list.photos = list.photos.split(',')
      }
      that.setData({
        content: list,
        id: res.data.object.id,
        options: options
      });
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