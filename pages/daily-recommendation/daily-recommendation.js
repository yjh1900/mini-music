// pages/daily-recommendation/daily-recommendation.js

import { request } from "../../utils/request";
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    recommendSongList:[]
  },

  goPlayer(e){
    wx.navigateTo({
      url: '/pages/music-player/music-player',
    })
    app.globalData.songs = this.data.recommendSongList
    app.globalData.songIndex = e.currentTarget.dataset.index
    // console.log(app.globalData.songs,app.globalData.songIndex);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const songList = await request({
      url:"/recommend/songs"
    })
    // console.log(songList);
    this.setData({
      recommendSongList:songList.data.dailySongs
    })
  },

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
