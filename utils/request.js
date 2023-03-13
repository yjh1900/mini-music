const app = getApp()
const BASE_URL = 'http://localhost:3000'
export const request = function({url,method,data}){
  return new Promise((resolve,reject)=>{
    wx.request({
      url: BASE_URL + url,
      method,
      data,
      header:{
        // 手机频繁扫码被状态异常了，暂时使用写死的cookie
        cookie:app.globalData.cookie
        // cookie:'MUSIC_U=1527a9d98157a734fb3635f0aa3ab83659fec49253a4f630b4e2f675f87dbb1f519e07624a9f0053cff91e896e33943e358157b0746dd0dd79ea75bea1cbc7b9b60793504745bfab1b93ac14e0ed86ab'
        // cookie:'MUSIC_U=1527a9d98157a734fb3635f0aa3ab83659fec49253a4f630bd6accbc78b59b10519e07624a9f0053e92051280830cf180b1065a950d0c06379ea75bea1cbc7b9b60793504745bfab1b93ac14e0ed86ab; Max-Age=15552000; Expires=Fri, 08 Sep 2023 08:57:08 GMT; Path=/; HTTPOnly'
      },
      // 箭头函数的this才会指向onload函数，和当前的实例是一致的
      // 只要成功接收到服务器返回，无论 statusCode 是多少，都会进入 success 回调， 只有服务器没有返回才会进入fail
      success:(res)=>{
        /* 
          res:{
            data:{
              code: 200 // 功能状态码
            } // 服务器响应数据
            statusCode：200 // 服务器响应状态码
          }
        */

       if(res.statusCode>=200&&res.statusCode<300){
        // console.log(app.globalData.cookie,'globalData');
        resolve(res.data)
      }
        else{
          wx.showToast({
            title: '请求失败',
            icon: 'error'
          })
          reject('请求失败')
        }
        
      },
      fail:(err)=>{
        console.log(err,'err');
        wx.showToast({
          title: '服务器失去连接',
          icon: 'error'
        })
        reject('请求失败')
      },
    })
  })
  
}