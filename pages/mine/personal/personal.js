var network = require("./../../../lib/http.js");
const app = getApp()


Page({
  /**
   * 页面的初始数据
   */
  data: {
    array: ['男', '女'
    ],
    sexName:'',
    edit: true,
    complete: false,
    name:'',
    age: '',
    budget: '',
    address: '',
    nowTime: ''
  },
  name: function (e) {
    console.log(e)
    this.setData({
      name: e.detail.value
    })
  },
  age: function (e) {
    console.log(e.detail.value)
    this.setData({
      age: e.detail.value
    })
  },
  budget: function (e) {
    console.log(e.detail.value)
    this.setData({
      budget: e.detail.value
    })
  },
  address: function (e) {
    console.log(e.detail.value)
    this.setData({
      address: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    
    this.setData({
      sexName: this.data.array[e.detail.value]
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
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
  save:function(){
    var params = {};
    if (this.data.sexName === '男'){
      params.sex = 0;
    }else{
      params.sex = 1;
    }
    params.username = this.data.name;
    params.marryAge = this.data.age;
    params.marryWeddingDay = this.data.date;
    params.marryBudget = this.data.budget;
    params.marryAddress = this.data.address;
    params.token = app.globalData.token;
    if (params.username == '') {
      this.toast('请填写您的姓名')
    } else if (params.marryAge == '') {
      this.toast('请填写您的年龄')
    } else if (params.sex == undefined) {
      this.toast('请选择您的性别')
    } else if (params.marryWeddingDay == undefined) {
      this.toast('请选择您的婚礼日期')
    } else if (params.marryBudget == '') {
      this.toast('请填写您的预算金额')
    } else if (params.marryAddress == '') {
      this.toast('请填写您婚礼的举办地点')
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      var that = this;
      network.postData("userInfo/saveUserInfo", params, function (res) {
        console.log(res)
        wx.hideLoading()
        that.setData({
          edit: false,
          complete: true
        })
      })
    }
  },
  buttonEdit:function(){
    this.setData({
      edit: true,
      complete: false
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
    network.getData("userInfo/getUserInfo", token, function (res) {
      console.log(res)
      var status = res.data.object.status
      var sexName = that.data.array[res.data.object.sex]
      console.log(status)
      if (status === 2) {
        that.setData({
          edit: false,
          complete: true,
          sexName: sexName,
          name:res.data.object.username,
          age: res.data.object.marryAge,
          date: res.data.object.marryWeddingDay,
          budget: res.data.object.marryBudget,
          address: res.data.object.marryAddress 
        })
      }
      wx.hideLoading()
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