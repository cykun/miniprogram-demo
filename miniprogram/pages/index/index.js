//index.js

Page({
  data: {
    showUploadTip: false,
    blogList: [],
  },
  onLoad: function() {
    this.loadBlogList()
  },
  loadBlogList() {
    let that = this
    wx.request({
      url: 'http://localhost:8080/api/v1/blogs',
      success: (res)=> {
        let result = res.data;
        console.log(result)
        if(result.code == 0) {
          that.setData({
            blogList: result.data
          })
        }
      }
    })
  },
  jumpPage(e) {
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.page}/index`,
    })
  },
})