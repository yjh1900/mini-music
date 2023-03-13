import { request } from "../../utils/request";

// pages/my/my.js
const app = getApp()
const isLogin =  !!Object.keys(app.globalData.user).length;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin : !!Object.keys(app.globalData.user).length,
    loginName: isLogin?app.globalData.user.nickName:"立即登录",
    avatarUrl : app.globalData.user.avatarUrl
  },

  toLoginPrepare(){
    wx.navigateTo({
      url: '/login/pages/login/login-prepare/login-prepare',
    })
  },
  getCookie(cookieName,cookies){
    const array = cookies.split(';')
    return array.filter((item)=>{
      if(item.includes(cookieName)){
        return item
      }
    })
  },
  async testUser(){
    // console.log(app.globalData.user,'user');
    const a = await request({
      url:'/user/account',
      timerstamp: new Date().getTime()
    })
    console.log(a,'账号信息');
    console.log(app.globalData.user,'user');
    // wx.setStorageSync('user', JSON.stringify(app.globalData.user))
    // wx.setStorageSync('cookie', JSON.stringify(app.globalData.cookie))

    // const b = await request({
    //   url:'/login/status',
    //   data:{
    //     timerstamp: new Date().getTime()
    //   }
    // })
    // console.log(b,'登陆状态');
  // console.log(this.getCookie('MUSIC_U',app.globalData.user.cookie),'token');

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
