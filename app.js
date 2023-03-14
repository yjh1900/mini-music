let user = wx.getStorageSync('user');
let cookie = wx.getStorageSync('cookie');
if(user){
  user = JSON.parse(user)
}else{
  user={}
}

if(cookie){
  user = JSON.parse(cookie)
}else{
  cookie={}
}

App({
  globalData:{
    user:{
      nickName:"猪很圆",
      avatarUrl:"http://p2.music.126.net/92Y7fDsSJ6NEUPSs9i3s9A==/109951163413325050.jpg",
      userId:95348569
    },
    // 手机频繁扫码导致设备异常，暂时写死的cookie
    cookie:"MUSIC_U=1527a9d98157a734fb3635f0aa3ab83659fec49253a4f630b4e2f675f87dbb1f519e07624a9f0053cff91e896e33943e358157b0746dd0dd79ea75bea1cbc7b9b60793504745bfab1b93ac14e0ed86ab",
    songs:[],
    songIndex:0
  }
})
