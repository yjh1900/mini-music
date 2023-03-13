// pages/home/home.js
import {request} from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图
    bannerList:[],
    // 推荐歌单
    songSheets:[],
    hotTags:[],
    hotSheetName:[],

  },
  goDailyRec(){
    wx.navigateTo({
      url: '/pages/daily-recommendation/daily-recommendation'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const type = _getSystemType()
    const res = await request({
      url:'/banner',
      data:{
        type
      },
      method:'GET'
    })
    this.setData({
      bannerList:res.banners
    })

    function _getSystemType(){
      const res = wx.getSystemInfoSync()
      let type = 0
      if(res.system.includes('iOS')){
        type = 2
        if(res.model.includes('iPad')){
          type = 3
        }
      }
      else if(res.system.includes('Android')){
        type = 1
      }
      return type
    }

    // 简单封装，但还是需要在success函数中处理
    // request({
    //   url:'/banner',
    //   data:{
    //     type:2
    //   },
    //   fn:(res)=>{
    //     this.setData({
    //       bannerList:res.data.banners
    //     })
    //   }
    // })


    // wx.request({
    //   url: 'http://localhost:3000/banner',
    //   data:{
    //     type:2
    //   },
    //   // 箭头函数的this才会指向onload函数，和当前的实例是一致的
    //   // 只要成功接收到服务器返回，无论 statusCode 是多少，都会进入 success 回调， 只有服务器没有返回才会进入fail
    //   success:(res)=>{
    //     /* 
    //       res:{
    //         data:{
    //           code: 200 // 功能状态码
    //         } // 服务器响应数据
    //         statusCode：200 // 服务器响应状态码
    //       }
    //     */
    //    if(res.statusCode>=200&&res.statusCode<300){
    //     this.setData({
    //       bannerList:res.data.banners
    //     })
    //   }
    //     else{
    //       wx.showToast({
    //         title: '请求失败',
    //         icon: 'error'
    //       })
    //     }
        
    //   },
    //   fail:(err)=>{
    //     console.log(err,'err');
    //     wx.showToast({
    //       title: '没有与服务器建立连接',
    //       icon: 'error'
    //     })
    //   },
    // })
    


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    // this._getHotTags();
    this._getSongSheets()
  },

  async _getSongSheets(){
   const res = await request({
     url:'/personalized',
     data:{
        limit:20
     }
    })
  this.setData({
    songSheets : res.result.map((item)=>{
      const {name,picUrl,id,playCount:count} = item
      let playCount = count.toString().substring(4)+'万';
      return {
        name,
        picUrl,
        id,
        playCount
      }
    })
  })
  },

   // 获取热门标签
  async _getHotTags() {
    // const res = await request('/playlist/highquality/tags');
    // this.setData({
    //   hotTags: res.tags.slice(0, 5).map(item => item.name)
    // })

    // this._getHotSongs(this.data.currentHotTagIndex);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})