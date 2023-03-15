import { request } from "../../utils/request";

// pages/music-player/music-player.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    songs: [],
    // 当前正在播放音乐
    song: {},
    playUrl: "",
    startTime: 0,
    endTime: 0,
    startTimeText: "00:00",
    endTimeText: "00:00",
    progressWidth: 0,
    isPlay: true,
    playMode: app.globalData.playMode,
    isShowLyric: true,
    lyric: [],
    currentLyricIndex: 0
  },

  formatTime(time) {
    /* 使用date将时间戳变为时间点
      new Date(241423)
      Thu Jan 01 1970 08:04:01 GMT+0800 (中国标准时间) {}
   */
    const date = new Date(time)
    let minite = date.getMinutes()
    let second = date.getSeconds()
    minite = minite >= 10 ? minite : "0" + minite
    second = second >= 10 ? second : "0" + second
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
    // 拿到进度条dom元素，boundingClientRect获取相对视口的距离和元素大小
    wx.createSelectorQuery().select('.music-line-wrap').boundingClientRect().exec((res) => {
      this.lineLeft = res[0].left;
      this.lineWidth = res[0].width;
    })
  },
  // 点击跳转进度条
  jumpProgress(e) {
    const persent = (e.detail.x - this.lineLeft) / this.lineWidth
    this.setData({
      startTime: persent * this.data.endTime,
      progressWidth: persent * 100 + "%"
    })
    this.backgroundAudioManager.seek(persent * this.data.endTime / 1000)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    // 根据app数据修改本页数据
    this.setData({
      playMode: app.globalData.playMode
    })
    if (app.globalData.playMode === 2) {
      this.setData({
        songs: app.globalData.randomSongs
      })

      // 找到原来歌曲在新数组的index，重新给送Index赋值
      app.globalData.songIndex = [...app.globalData.randomSongs].findIndex((item) => item.id === app.globalData.songs[app.globalData.songIndex].id)

    } else {
      this.setData({
        songs: app.globalData.songs
      })
    }
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    this.backgroundAudioManager = backgroundAudioManager

    this.playSongHandle()


    // const { songs, songIndex } = app.globalData
    // this.setData({
    //   song: songs[songIndex]
    // })
    // const playSong = await request({
    //   url: "/song/url/v1",
    //   data: {
    //     id: this.data.song.id,
    //     level: 'higher'
    //   }
    // })
    // const { time, url } = playSong.data[0]

    // this.setData({
    //   playUrl: url,
    //   endTime: time,
    //   endTimeText: this.formatTime(time)
    // })
    // const backgroundAudioManager = wx.getBackgroundAudioManager()
    // this.backgroundAudioManager = backgroundAudioManager
    // backgroundAudioManager.src = this.data.playUrl
    // backgroundAudioManager.title = this.data.song.name

    backgroundAudioManager.onTimeUpdate(() => {
      if (this.isTouch) return
      // 当前播放时间（毫秒）
      const current = backgroundAudioManager.currentTime * 1000
      this.setData({
        startTime: current,
        startTimeText: this.formatTime(current),
        progressWidth: this.data.startTime / this.data.endTime * 100 + "%"
      })
      // 查找歌词
      // if(this.data.lyric[this.data.currentLyricIndex].time> this.data.startTime){
      //   this.setData({
      //     currentLyricIndex: currentLyricIndex + 1
      //   })
      // }
      // console.log(this.data.currentLyricIndex);
    })
    // backgroundAudioManager.onEnded(() => {
    //   this.nextSong()
    // })
    backgroundAudioManager.onEnded(() => {
      // 单曲循环播完之后先将index--，在nextSong中index++
      // 自然播放结束后就会从当前下标继续播放
      if (app.globalData.playMode === 1) app.globalData.songIndex--
      this.nextSong()
    })
  },

  // 手指按下
  touchstartHandle(e) {
    this.touchmoveHandle(e)
    this.animate(".music-line-wrap", [
      { height: "1px" }, { height: "3px" }
    ], 100)
    this.animate(".music-active-point", [
      { height: "14rpx", width: "14rpx" }, { height: "17rpx", width: "17rpx" }
    ], 100)
    this.isTouch = true
  },
  // 手指按下移动
  touchmoveHandle(e) {
    let persent = (e.changedTouches[0].clientX - this.lineLeft) / this.lineWidth
    if (persent < 0) persent = 0
    if (persent > 1) persent = 1
    this.setData({
      progressWidth: persent * 100 + "%",
      startTime: persent * this.data.endTime,
      startTimeText: this.formatTime(this.data.startTime),
    })
  },
  // 手指抬起
  touchendHandle(e) {
    let persent = (e.changedTouches[0].clientX - this.lineLeft) / this.lineWidth
    if (persent < 0) persent = 0
    if (persent > 1) persent = 1
    this.setData({
      progressWidth: persent * 100 + "%",
      startTime: persent * this.data.endTime
    })
    this.backgroundAudioManager.seek(persent * this.data.endTime / 1000)
    this.isTouch = false
    this.animate(".music-line-wrap", [
      { height: "3px" }, { height: "1px" }
    ], 100)
    this.animate(".music-active-point", [
      { height: "17rpx", width: "17rpx" }, { height: "14rpx", width: "14rpx" }
    ], 100)
  },

  // 播放暂停
  playOrPause() {
    if (this.data.isPlay) {
      this.backgroundAudioManager.pause()
      this.setData({
        isPlay: false
      })
    } else {
      this.backgroundAudioManager.play()
      this.setData({
        isPlay: true
      })
    }
  },

  // 处理歌词时间函数
  handleTime(time) {
    let m = time.split(":")[0] * 60 * 1000
    let s = time.split(":")[1].split(".")[0] * 1000
    // 这里需要 × 1，转换为数值
    let ms = time.split(":")[1].split(".")[1] * 1
    time = m + s + ms
    return time
  },

  // 通过最新下标获取歌曲数据
  // 通过歌曲id请求歌曲url
  // 设置backgroundAudioManager.src, 自动播放新歌曲
  async playSongHandle() {
    console.log(this.data.songs, app.globalData.songIndex);
    this.setData({
      song: this.data.songs[app.globalData.songIndex],
    })
    const playSong = await request({
      url: "/song/url/v1",
      data: {
        id: this.data.song.id,
        level: 'higher'
      }
    })
    const { time, url } = playSong.data[0]
    this.setData({
      playUrl: url,
      endTime: time,
      endTimeText: this.formatTime(time)
    })
    this.backgroundAudioManager.src = this.data.playUrl
    this.backgroundAudioManager.title = this.data.song.name

    const lyricRes = await request({
      url: "/lyric",
      data: {
        id: this.data.song.id
      }
    })
    console.log(lyricRes.lrc.lyric, 'lyric');
    this.setData({
      lyric: lyricRes.lrc.lyric.split('\n').filter(Boolean).map((item) => {
        return {
          time: this.handleTime(item.split(']')[0].substring(1)),
          text: item.split(']')[1]
        }
      })
    })
    // console.log(songs, 'songs');

    // this.setData({
    //   song: this.data.songs[app.globalData.songIndex],
    // })
    // const playSong = await request({
    //   url: "/song/url/v1",
    //   data: {
    //     id: this.data.song.id,
    //     level: 'higher'
    //   }
    // })
    // const { time, url } = playSong.data[0]

    // this.setData({
    //   playUrl: url,
    //   endTime: time,
    //   endTimeText: this.formatTime(time)
    // })

    // backgroundAudioManager.src = this.data.playUrl
    // backgroundAudioManager.title = this.data.song.name
  },

  // 下一首
  nextSong() {
    const { songIndex } = app.globalData
    // 根据三种状态，设置不同的index
    // 0：顺序播放
    //    每次index+1，直到index = songs.length时将index置0
    // 1：单曲循环
    //    每次index不变，这里++，在播放完的时刻立即--，所以抵消了，下标不变
    // 2：随机播放
    //    重新生成一个乱序列表，在哪里生成呢？
    //    可以在页面onload的时候创建一个乱序列表，然后保存到集中状态管理中心
    //    在切换播放模式的时候，找到当前播放的歌曲在新列表的下标newIndex
    //    点击下一首时从newIndex开始播放，这样就能保证不会出现连着播放相同的歌
    app.globalData.songIndex = songIndex === this.data.songs.length - 1 ? 0 : songIndex + 1
    this.playSongHandle()

  },
  // 上一首
  previousSong() {
    const { songIndex } = app.globalData
    app.globalData.songIndex = (songIndex ? songIndex - 1 : this.data.songs.length - 1)
    this.playSongHandle()

  },
  // 切换播放状态
  switchMode() {
    if (app.globalData.playMode === 2) {
      app.globalData.playMode = 0
      // 获取当前播放歌曲的下标
      this.setData({
        playMode: 0,
        songs: app.globalData.songs
      })
    }
    else if (app.globalData.playMode === 1) {
      app.globalData.playMode = app.globalData.playMode + 1
      app.globalData.randomSongs = [...app.globalData.songs].sort(() => Math.random() - 0.5)
      this.setData({
        playMode: app.globalData.playMode,
        songs: app.globalData.randomSongs
      })
    }
    else {
      app.globalData.playMode = app.globalData.playMode + 1
      this.setData({
        playMode: app.globalData.playMode,
      })
    }
    // 找到当前播放的歌曲在歌曲列表的下标newIndex
    const index = (app.globalData.playMode === 2 ? app.globalData.randomSongs : app.globalData.songs).findIndex((item) => item.id === this.data.song.id)
    // 将集中状态中心存储的下标数据改为newIndex
    app.globalData.songIndex = index
  },

  showLyric() {
    this.setData({
      isShowLyric: !this.data.isShowLyric
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() { },
});
