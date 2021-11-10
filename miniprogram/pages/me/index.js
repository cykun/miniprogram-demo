// pages/login/index.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUseGetUserProfile: false,
    userInfo: {},
    hasUserInfo: false,
    avatarUrl: '../../images/default_headicon.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this;
    if (wx.getUserProfile) {
      that.setData({
        canIUseGetUserProfile: true
      })
    }
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          userInfo: JSON.parse(res.data),
          hasUserInfo: true
        })
      }
    })
  },
  handleAuth(e) {
    if (this.data.hasUserInfo) {
      this.logout(e)
    } else {
      this.wxLogin(e)
    }
  },
  // getUserProfile(e) {
  //   // wx1eadf68e5dbaf5fa
  //   // 8e42522346222038bc296e6bc33ada8d
  //   wx.getUserProfile({
  //     desc: '用于完善会员资料',
  //     success: (res) => {
  //       console.log(res.userInfo)
  //       this.setData({
  //         userInfo: res.userInfo,
  //         avatarUrl: res.userInfo.avatarUrl,
  //         hasUserInfo: true
  //       })
  //       wx.setStorageSync("userInfo", JSON.stringify(res.userInfo))
  //       wx.login({
  //         success: (e) => {
  //           console.log(e.code)
  //           wx.request({
  //             url: `http://localhost:8080/api/v1/wx/session/${e.code}`,
  //             success: (res) => {
  //               console.log(res)
  //             }
  //           })
  //         }
  //       })
  //     }
  //   })
  // },
  // getUserInfo(e) {
  //   if (e.detail.userInfo) {
  //     console.log("用户的信息如下：");
  //     console.log(e.detail.userInfo);
  //     //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
  //     this.setData({
  //       hasUserInfo: true,
  //       userInfo: e.detail.userInfo
  //     });
  //   } else {
  //     wx.showModal({
  //       title: '警告',
  //       content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
  //       showCancel: false,
  //       confirmText: '返回授权',
  //       success: function (res) {
  //         if (e.confirm) {
  //           console.log('用户点击了“返回授权”');
  //         }
  //       }
  //     });
  //   }
  // },
  wxGetUserProfile: function () {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        lang: 'zh_CN',
        desc: '用户登录',
        success: (res) => {
          resolve(res)
        },
        // 失败回调
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  wxSilentLogin: function () {
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          console.log(res.code)
          resolve(res.code)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },
  wxLogin: function (e) {
    let that = this
    let p1 = this.wxSilentLogin()
    let p2 = this.wxGetUserProfile()
    p1.then(code => {
      return new Promise((resolve, reject) => {
        p2.then(res => {
          console.log(res)
          that.setData({
            userInfo: res.userInfo,
            avatarUrl: res.userInfo.avatarUrl,
            hasUserInfo: true
          })
          wx.setStorageSync("userInfo", JSON.stringify(res.userInfo))
          resolve({
            code,
            iv: res.iv,
            encryptedData: res.encryptedData
          })
        }).catch(err => {
          reject(err)
        })
      })
    }).then(res => {
      // 请求服务器
      wx.request({
        url: 'http://localhost:8080/api/v1/wx/session',
        method: 'post',
        data: {
          code: res.code,
          encrypted_data: res.encryptedData,
          iv: res.iv
        },
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          let result = res.data
          if(result.code == 0) {
            console.log(result.data)
            app.globalData.token = result.data
          }
        }
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  logout(e) {
    this.setData({
      hasUserInfo: false,
      userInfo: {}
    })
    wx.removeStorage({
      key: 'userInfo',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})