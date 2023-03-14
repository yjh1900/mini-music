// pages/login-prepare/login-prepare.js
import {request} from '../../../../utils/request.js';
const app = getApp()


Page({
  /**
   * 页面的初始数据
   */
  data: {
    codeImg:''
  },
  getCookie(cookieName,cookies){
    const array = cookies.split(';')
    return array.filter((item)=>{
      if(item.includes(cookieName)){
        return item
      }
    })
  },
  // 登录
  async login(){
    // 1.请求二维码key
    const res = await request({
      url:"/login/qr/key",
      timerstamp: new Date().getTime()
    })
    // 2.上一个请求的key值作为参数，请求二维码图片信息
    const imgInfo = await request({
      url:"/login/qr/create",
      data:{
        key:res.data.unikey,
        timerstamp: new Date().getTime(),
        qrimg:true
      }
    })
    this.setData({
      codeImg:imgInfo.data.qrimg
    })
    // 3.轮询检查二维码扫描状态
    const timeOut = setInterval(async () => {
      const result = await request({
        url:"/login/qr/check",
        data:{
          key:res.data.unikey,
          timerstamp: new Date().getTime()
        },
      })
      console.log(result);
       if(result.code === 803){
        wx.showToast({
          title: '登陆成功',
          icon:'success'
        })
        wx.switchTab({
          url: '/pages/my/my',
        })
        clearInterval(timeOut)
        const cookie = this.getCookie('MUSIC_U',result.cookie)
        wx.setStorageSync('cookie', JSON.stringify({cookie}))
        app.globalData.cookie = cookie

        const userInfo = await request({
          url:'/user/account',
          timerstamp: new Date().getTime()
        })
        console.log(userInfo);

        const { nickName, userId, avatarUrl} = userInfo.profile
        const user = {
          nickName, userId, avatarUrl
        }
        // 持久化存储
        wx.setStorageSync('user', JSON.stringify(user))

        // 集中式状态管理工具
        app.globalData.user = user
        console.log(app.globalData.user);

        // clearInterval(timeOut)
      }
    }, 1000);
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
  onHide() {
    clearInterval(timeOut)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    clearInterval(timeOut)
  },

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
