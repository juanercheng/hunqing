var network = require("./../../../lib/http.js");
const app = getApp()


Page({
  /** 
   * 页面的初始数据
   */
  data: {
    style: ['男', '女'
    ],
    edit: true,
    complete: false, 
    name: '',
    address: '',
    weddingDay: '',
    style1: '',
    budget: '',
    message: '',
    date:'',
    nowTime: ''
  },
  bindPickerChange: function (e) {
    this.setData({
      styleName: this.data.style[e.detail.value],
    })
  },
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  name: function (e) {
    console.log(e.detail.value)
    this.setData({
      name: e.detail.value
    })
  },
  address: function (e) {
    console.log(e.detail.value)
    this.setData({
      address: e.detail.value
    })
  },
  budget: function (e) {
    console.log(e.detail.value)
    this.setData({
      budget: e.detail.value
    })
  },
  textarea: function (e) {
    console.log(e.detail.value)
    this.setData({
      textarea: e.detail.value
    })
  },
  //提示
  toast: function (text) {
    wx.showModal({
      title: '温馨提示',
      content: text,
      showCancel: false
    })
  },
  //完成
  save: function () {
    var params = {}
    var that = this
    that.data.content.map(function(value,index){
      if (value.name === that.data.styleName){
        params.style = value.id
      }
    })
    params.username = that.data.name;
    params.address = that.data.address;
    params.weddingDay = that.data.date;
    params.budget = that.data.budget;
    params.message = that.data.textarea;
    params.token = app.globalData.token;
    if (params.username == '') {
      that.toast('请填写您的姓名')
    } else if (params.address == '') {
      that.toast('请填写您的地址')
    } else if (params.weddingDay == undefined) {
      that.toast('请选择您的婚礼日期')
    } else if (params.style == undefined) {
      that.toast('请选择您想要的风格')
    } else if (params.budget == '') {
      that.toast('请填写您的预算金额')
    } else if (params.message == undefined) {
      that.toast('请填写留言')
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      network.postData("userInfo/privateCustom", params, function (res) {
        if(res.data.code===0){
          wx.hideLoading()
          that.setData({
            edit: false,
            complete: true,
          })
        }
      })
    }
  },
  buttonEdit:function(){
    this.setData({
      edit: true,
      complete: false,
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
    var token = {
      token: app.globalData.token
    }
    var time = new Date()
    var month = time.getMonth() + 1
    var nowTime = time.getFullYear() + '-' + month + '-' + time.getDate()
    this.setData({
      nowTime: nowTime
    })
    var that = this;
    network.getData("userInfo/getPrivateCustom", token, function (res) {
      console.log(res)
      var status = res.data.code
      if (status !== 500) {
        console.log(res.data.object)
        let msg = res.data.object
        var date = msg.weddingDay.split(' ')
        that.setData({
          edit: false,
          complete: true,
          name: msg.username,
          address: msg.address,
          date: date[0],
          styleName: msg.styleEntity.name,
          budget: msg.budget,
          textarea: msg.message,
        })
      }
      wx.hideLoading()
      console.log(that.data.date)
    })
    var params = {
      dictTypeCodes: 'TYPE_STYLE'
    }
    //风格
    network.getData("cfg/dictInfos", params, function (res) {
      console.log(res)
      var style = res.data.object
      var content = []
      style.map(function (value, index) {
        content.push(value.name)
      })
      that.setData({
        style: content,
        content: style
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { }
})