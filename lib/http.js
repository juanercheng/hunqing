const http = 'http://101.132.67.23:8888/hunqing/api/'
// const http = 'http://192.168.0.112:8981/hunqing/api/'


function post(url, params, callback){
  if (params) { 
    let paramsArray = []; 
    //拼接参数
    Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
    console.log(paramsArray)
    if (url.search(/\?/) === -1) {
      url += '?' + paramsArray.join('&')
      console.log(url)
    } else {
      url += '&' + paramsArray.join('&')
      console.log(url)
    }
  } 
  wx.request({
    url: http + url,
    header: {
      'Content-Type': 'application/ json;charset=UTF - 8;'
    },
    method: "POST",
    success: function (res) {
      console.log()
      if (res.header["Set-Cookie"] == undefined){

      }else{
        wx.setStorageSync("sessionid", res.header["Set-Cookie"])
      }
      if(res.data.code == 101){
        console.log(123)
        wx.redirectTo({
          url: '/pages/mine/trigger/trigger'
        })
      }
      callback(res)
    },
    fail: function (res) {
      console.log(res)
    },
  })
}
function getData(url, params, callback) {
  if (params) {
    let paramsArray = [];
    //拼接参数
    Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
    if (url.search(/\?/) === -1) {
      url += '?' + paramsArray.join('&')
    } else {
      url += '&' + paramsArray.join('&')
    }
  }
  wx.request({
    url: http + url,
    header: {
      'Content-Type': 'application/ json;charset=UTF - 8;'
    },
    method: "GET",
    success: function (res) {
      // wx.setStorageSync("sessionid", res.header["Set-Cookie"])
      if (res.data.code == 101) {
        console.log(123)
        wx.redirectTo({
          url: '/pages/mine/trigger/trigger'
        })
      }
      callback(res)
    },
    fail: function (res) {
      console.log(res)
    },
  })
}

module.exports = {
  postData: post,
  getData: getData,
  http:http
}