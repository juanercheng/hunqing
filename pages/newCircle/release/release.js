var network = require("./../../../lib/http.js");
const app = getApp()


Page({

  /** 
   * 页面的初始数据
   */
  data: {
    images: [],
    imagesContent: false,
    addImages: true,
    text: '',
    imagesUrl: [],
    orderNo:null
  },
  textarea: function(event) {
    console.log(event.detail.value)
    this.setData({
      text: event.detail.value
    })
    if (this.data.text == '' && this.data.images.length == 0) {
      this.setData({
        sendDisabled: true
      })
    } else {
      this.setData({
        sendDisabled: false
      })
    }
  },
  add: function() {
    let that = this
    wx.chooseImage({
      count: 9, // 默认9

      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res);
        var tempFilePaths = res.tempFilePaths;
        var images = that.data.images;
        tempFilePaths.map(function(value, index) {
          if (images.length < 9) {
            images.push(value);
            if (images.length == 9) {
              that.setData({
                addImages: false
              })
            }
          } else {
            wx.showModal({
              title: '温馨提示',
              content: '最多只能上传九张图片',
              success: function(res) {
                if (res.confirm) {} else if (res.cancel) {}
              }
            })
          }
        })
        that.setData({
          images: images,
          imagesContent: true
        })
        console.log()
        if (that.data.text == '' && that.data.images.length == 0) {
          that.setData({
            sendDisabled: true
          })
        } else {
          that.setData({
            sendDisabled: false
          })
        }
      }
    })
  },
  deleteImage: function(event) {
    let id = Number(event.target.id);
    let images = this.data.images;
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '确认删除该图片吗？',
      success: function(res) {
        if (res.confirm) {
          images.map((value, index) => {
            if (index == id) {
              images.splice(index, 1)
            }
          });
          that.setData({
            images: images,
            addImages: true
          })
          if (that.data.text == '' && that.data.images.length == 0) {
            that.setData({
              sendDisabled: true
            })
          } else {
            that.setData({
              sendDisabled: false
            })
          }
        } else if (res.cancel) {}
      }
    })
  },
  imageUpload: function(data) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',
      formData: null,
      success: (res) => {
        success++; //图片上传成功，图片上传成功的变量+1
        var jsonStr = res.data; //json转对象;
        jsonStr = jsonStr.replace(" ", "");
        if (typeof jsonStr != 'object') {
          jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
          var data = JSON.parse(jsonStr);
          res.data = data;
        }
        console.log(res)
        var imagesUrl = that.data.imagesUrl;
        imagesUrl.push(res.data.object[0])
        that.setData({
          imagesUrl: imagesUrl
        })
      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) { //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          console.log(that.data.imagesUrl)

          if (this.data.orderNo == null) {
            var params = {
              token: app.globalData.token,
            };
            if (this.data.text == '') {
              console.log('没有')
              params.photos = that.data.imagesUrl;
              imagesContent(params)
            } else {
              console.log('有')
              params.content = this.data.text;
              params.photos = that.data.imagesUrl
              imagesContent(params)
            }
          } else {
            var params = {
              token: app.globalData.token,
              orderNo: this.data.orderNo
            };
            if (this.data.text == '') {
              console.log('没有')
              params.photos = that.data.imagesUrl;
              imagesContentOrderNo(params)
            } else {
              console.log('有')
              params.content = this.data.text;
              params.photos = that.data.imagesUrl
              imagesContentOrderNo(params)
            }
          }
          function imagesContentOrderNo(params){
            network.postData("busorder/commentOrder", params, function (res) {
              wx.hideLoading();
              console.log(res)
              wx.reLaunch({
                url: '/pages/weddingCenter/weddingCenter/weddingCenter'
              });
            })
          }
          function imagesContent(params) {
            network.postData("moment/sendComment", params, function (res) {
              wx.hideLoading();
              console.log(res)
              wx.reLaunch({
                url: '/pages/newCircle/newCircle/newCircle'
              });
            })
          }
        } else { //若图片还没有传完，则继续调用函数
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.imageUpload(data);
        }
      }
    });
  },
  send: function() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (this.data.orderNo == null) {
      var params = {
        token: app.globalData.token,
      };
      if (this.data.images.length == 0) {
        console.log(123)
        params.content = this.data.text;
        network.postData("moment/sendComment", params, function (res) {
          wx.hideLoading();
          console.log(res)
          wx.reLaunch({
            url: '/pages/newCircle/newCircle/newCircle'
          });
        })
      } else {
        var images = {
          myfile: this.data.images,
        }
        console.log(this.data.images)
        var pics = this.data.images;
        this.imageUpload({
          url: network.http + 'fileUploads',
          path: pics //这里是选取的图片的地址数组
        });
      }
    } else {
      var params = {
        token: app.globalData.token,
        orderNo: this.data.orderNo
      };
      if (this.data.images.length == 0) {
        console.log(123)
        params.content = this.data.text;
        network.postData("busorder/commentOrder", params, function (res) {
          wx.hideLoading();
          console.log(res)
          wx.reLaunch({
            url: '/pages/weddingCenter/weddingCenter/weddingCenter'
          });
        })
      } else {
        var images = {
          myfile: this.data.images,
        }
        console.log(this.data.images)
        var pics = this.data.images;
        this.imageUpload({
          url: network.http + 'fileUploads',
          path: pics //这里是选取的图片的地址数组
        });
      }
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options.orderNo == undefined){
      this.setData({
        sendDisabled: true,
        
      })
    }else{
      this.setData({
        sendDisabled: true,
        orderNo: options.orderNo
      })
    }
    
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