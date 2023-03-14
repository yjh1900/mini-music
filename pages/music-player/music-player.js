import { request } from "../../utils/request";

// pages/music-player/music-player.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 当前正在播放音乐
    song : {},
    playUrl:"",
    startTime:0,
    endTime:0,
    startTimeText:"00:00",
    endTimeText:"00:00",
    progressWidth:0,
  },
  formatTime(time) {
     /* 使用date将时间戳变为时间点
       new Date(241423)
       Thu Jan 01 1970 08:04:01 GMT+0800 (中国标准时间) {}
    */
    const date = new Date(time)
    let minite = date.getMinutes()
    let second = date.getSeconds()
    minite = minite > 10 ? minite : "0" + minite
    second = second > 10 ? second : "0" + second
    return minite + ":" + second
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.createSelectorQuery().select('.music-line-wrap').boundingClientRect().exec((res)=>{
      this.lineLeft = res[0].left;
      this.lineWidth = res[0].width;
      // console.log(this.lineLeft,this,"onReady");
    })
  },
  jumpProgress(e){
    const persent = (e.detail.x - this.lineLeft) / this.lineWidth
    this.backgroundAudioManager.seek(persent * this.data.endTime / 1000)
    this.setData({
      progressWidth: persent * 100 + "%"
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    const {songs, songIndex} = app.globalData
    this.setData({
      song:songs[songIndex]
    })

    const playSong = await request({
      url: "/song/url/v1",
      data: {
        id: this.data.song.id,
        level: 'higher'
      }
    })
    console.log(playSong);
    const {time, url} = playSong.data[0]

    this.setData({
      playUrl: url,
      endTime: time,
      endTimeText: this.formatTime(time)
    })
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    this.backgroundAudioManager = backgroundAudioManager
    backgroundAudioManager.src = this.data.playUrl
    backgroundAudioManager.title = this.data.song.name

    backgroundAudioManager.onTimeUpdate(()=>{
      // 当前播放时间（毫秒）
      const current = backgroundAudioManager.currentTime * 1000
      this.setData({
        startTime: current,
        startTimeText: this.formatTime(current),
        progressWidth: this.data.startTime / this.data.endTime * 100 + "%" 
      })
    })
  },



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
