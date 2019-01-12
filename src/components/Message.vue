<template>
  <div class="message">
    <fans-list ref="fans"></fans-list>
    <div class="msg">
      <div class="choose-type">
        <p>请选择要发送的消息类型</p>
        <Radio-group v-model="msgType">
          <Radio v-for="type in msgTypes" :label="type" :key="type"></Radio>
        </Radio-group>
      </div>
      <!-- 纯文本消息编辑 -->
      <div class="text-msg" v-if="msgType==='text'">
        <i-input v-model="textMsg" type="textarea" placeholder="请输入要发送的消息"></i-input>
      </div>
      <!-- 图文消息编辑 -->
      <div class="news-msg" v-show="msgType==='news'">
        <br>
        <Button type="primary" @click="getNews">从已有图文素材选择</Button>
        <i-input class="title" placeholder="请输入文章标题" v-model="title">
          <span slot="prepend">文章标题</span>
        </i-input>
        <div class="cover">
          <Card>
            <p slot="title">封面和摘要</p>
            <Row class="card-content" type="flex" justify="space-between" align="middle">
              <i-col span="6">
                <div class="sel-cover-image" @click="chooseCover">
                  <div class="cover-image" v-if="coverImg">
                    <img :src="coverImg" alt width="100%" height="100%">
                  </div>
                  <div v-else class="add-cover-image">
                    <Upload action="" :before-upload="beforeUpload">
                      <i class="iconfont icon-add"></i> <br>
                      <span>选择封面</span>
                    </Upload>
                  </div>
                </div>
              </i-col>
              <i-col span="17" offset="1">
                <div class="digest">
                  <i-input
                    v-model="digest"
                    type="textarea"
                    :rows="4"
                    placeholder="选填，如果不填写默认抓取正文前54个字"
                  ></i-input>
                </div>
              </i-col>
            </Row>
            <i-input placeholder="请输入文章作者" v-model="author">
              <span slot="prepend">文章作者</span>
            </i-input>
            <i-input placeholder="点击阅读原文后跳转的链接" v-model="sourceUrl">
              <span slot="prepend">原文链接</span>
            </i-input>
          </Card>
        </div>
        <div class="editor" ref="editor"></div>
        <br>
        <Row>
          <i-col span="6" offset="6">
            <Button type="primary" @click="saveNews">保存</Button>
          </i-col>
          <i-col span="6">
            <Button type="primary">保存并群发</Button>
          </i-col>
        </Row>
      </div>
      <br>
      <Row type="flex" align="middle" v-show="msgType==='text'">
        <i-col>
          <Row type="flex" align="middle">
            <i-col>发送给</i-col>
            <i-col>
              <Select v-model="previewOpenid" placeholder="选择发给谁预览" style="width: 100px">
                <Option
                  v-for="user in fansList"
                  :key="user.openid"
                  :value="user.openid"
                >{{user.nickname}}</Option>
              </Select>
            </i-col>
            <i-col>
              <Button type="primary" @click="previewMsg">预览</Button>
            </i-col>
            {{previewOpenid}}
          </Row>
        </i-col>
        <i-col :offset="3">
          <Button type="primary" @click="sendTextMsg">发送</Button>
        </i-col>
        <Button @click="test">click</Button>
      </Row>
    </div>
    <!-- 封面图片选择层 -->
    <div class="image-modal">
      <Modal v-model="imageListShow" draggable title="请选择封面图片" width="750" @on-ok="showCover">
        <Row type="flex">
          <i-col v-for="item in imageList" :key="item.media_id">
            <Card>
              <p slot="title" style="width: 140px">
                <i class="iconfont icon-select" :class="{'active':item.media_id===thumbMediaId}"></i>
                &nbsp; {{item.name}}
              </p>
              <div style="width: 140px; height: 140px; cursor: pointer" @click="clickImg(item)">
                <img :src="item.url" alt width="100%">
              </div>
            </Card>
          </i-col>
        </Row>
      </Modal>
    </div>
    <!-- 弹出层 -->
    <div class="news-modal">
      <!-- 缩略图选择框 -->
      <Modal v-model="thumbListShow" width="750">
        <Row type="flex">
          <i-col v-for="item in thumbsList" :key="item.media_id">
            <Card>
              <p slot="title" style="width: 140px">
                <i class="iconfont icon-select" :class="{'active':item.media_id===thumbMediaId}"></i>
                &nbsp; {{item.name}}
              </p>
              <div style="width: 140px; height: 140px; cursor: pointer" @click="clickImg(item)">
                <img :src="item.url" alt width="100%">
              </div>
            </Card>
          </i-col>
          <i-col>
            <Card>
              <Upload action :before-upload="beforeUpload">
                <Button type="primary">本地上传缩略图</Button>
                <p class="tips">缩略图大小不超过64kb</p>
              </Upload>
            </Card>
          </i-col>
        </Row>
      </Modal>
      <!-- 图文素材选择层 -->
      <Modal v-model="newsListShow">
        <Card>
          <ul>
            <li v-for="news in newsList" :key="news.media_id">
              <i class="iconfont icon-select"></i>
              {{news.content.news_item[0].title}}
            </li>
          </ul>
        </Card>
      </Modal>
      <!-- 发送成功提示框 -->
      <Modal v-model="sendSuccess"></Modal>
      <!-- 保存成功提示框 -->
      <Modal v-model="saveSuccess"></Modal>
    </div>
  </div>
</template>

<script>
import axios from '../http/axios'
import E from 'wangeditor' // 富文本编辑器
import FansList from './FansList'

export default {
  name: 'Message',
  components: {
    FansList
  },
  data () {
    return {
      thumbListShow: false, // 是否显示缩略图层
      newsListShow: false, // 是否显示图文列表层
      imageListShow: false, // 是否显示图片素材列表层
      msgType: 'text', // 选择发送消息的类型
      tags: [], // 公众号拥有的标签列表
      fansOpenId: [], // 公众号粉丝openid列表
      fansList: [], // 公众号粉丝列表，包含详细信息
      msgTypes: ['text', 'news', 'image', 'voice', 'video'], // 可选发送消息类型
      textMsg: '', // 将要发送的文本消息的内容
      previewOpenid: '', // 消息发给谁预览的openid
      author: '', // 文章作者
      title: '', // 图文素材标题
      imageList: [], // 图片列表
      newsList: [], // 图文消息列表
      editorContent: '', // 图文消息的content
      thumbMediaId: '', // 图文消息的封面图片mediaId
      digest: '', // 文章摘要
      sourceUrl: '', // 阅读原文地址
      showCoverPic: '1', // 是否显示封面
      saveSuccess: false, // 保存成功提示框
      sendSuccess: false, // 发送成功提示框
      coverImgUrl: '', // 展示在编辑页面的图片url
      coverImg: '', // 封面图片
      thumbsList: [] // 缩略图列表
    }
  },
  computed: {
    selFanList () {
      return this.$refs.fans.selFanList
    }
    // fansList () {
    //   return this.$refs.fans.fansList
    // }
  },
  filters: {
    getTagName (value) {
      switch (value) {
        case 100:
          return '普通组'
        case 101:
          return '教师组'
      }
    },
    formatTime (value) {
      let date = new Date(value * 1000)
      const Y = date.getFullYear()
      const M = date.getMonth()
      const D = date.getDate()
      const H = date.getHours()
      const m = date.getMinutes()
      return `${Y}-${M}-${D}  ${H}:${m}`
    }
  },

  mounted () {
    // 创建富文本编辑器
    const _this = this
    let editor = new E(this.$refs.editor)
    editor.customConfig.onchange = html => {
      this.editorContent = html
    }
    editor.create()
    this.$nextTick(() => {
      _this.fansList = _this.$refs.fans.fansList
    })
  },
  methods: {
    test () {
      const list = this.$refs.fans.fansList
      const selList = this.$refs.fans.selFanList
      const tags = this.$refs.fans.tags
      console.log(list)
      console.log('selfanslist', selList)
      console.log('this', this.selFanList)
      console.log('tags', tags)
    },
    // 上传缩略图
    beforeUpload (file) {
      console.log(file)
      const _this = this
      let formData = new FormData()
      formData.set('file', file)
      formData.set('type', 'thumb')
      formData.set('filename', file.name)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function () {
        _this.coverImg = this.result
      }      
      // 将缩略图作为临时素材上传
      this.$axios.post('/uploadThumbMedia', formData).then(res => {
        console.log(res)
        if (res.data.media_id) {
          alert('上传成功')
          _this.thumbMediaId = res.media_id          
        }
      })
      return false
    },

    // 选择封面图
    clickImg (data) {
      console.log(data)
      this.thumbMediaId = data.media_id
      this.coverImgUrl = data.url
    },
    // 将封面图展现在编辑页面
    showCover () {
      if (!this.coverImgUrl) {
        alert('您未选择任何图片')
      } else {
        this.coverImg = this.coverImgUrl
      }
    },
    // 发送文本消息
    sendTextMsg () {
      let openids = []
      this.fansList.forEach(item => {
        openids.push(item.openid)
      })
      let params = {
        content: this.textMsg,
        // 如果选择的是所有用户，receivers是openid列表，否则是标签id
        // receivers: this.selectTagId === 0? openids: this.selectTagId + ''
        receivers:
          this.$refs.fans.selectTagId === 0
            ? this.$refs.fans.openids
            : this.$refs.fans.selectTagId + ''
      }
      axios.post('/massSendText', JSON.stringify(params)).then(res => {
        console.log(res)
      })
    },
    // 预览消息
    previewMsg () {
      let params = {
        openid: this.previewOpenid,
        content: this.textMsg
      }
      axios
        .post('/previewText', JSON.stringify(params))
        .then(res => console.log(res))
    },
    // 弹出选择封面图片
    chooseCover () {
      const _this = this
    },

    // 获取图片素材
    _getImage () {
      const images = sessionStorage.getItem('image')
      const _this = this
      if (images && images !== 'undefined') {
        this.imageList = JSON.parse(images)
      } else {
        let params = {
          type: 'image', // 返回素材的类型: image, video, voice, news
          offset: 0, // 从全部素材的该位置处开始返回
          count: 20 // 返回素材的数量，取值1-20之间
        }
        this.$axios
          .post('/getMaterials', JSON.stringify(params))
          .then(res => {
            sessionStorage.setItem('image', JSON.stringify(res.data.item))
            _this.imageList = res.data.item
            _this.imageListShow = true
          })
          .catch(err => console.log(err))
      }
    },

    // 保存图文消息
    saveNews () {
      const article = {
        title: this.title,
        thumb_media_id: this.thumbMediaId,
        author: this.author,
        digest: this.digest,
        show_cover_pic: this.showCoverPic,
        content: this.editorContent,
        content_source_url: this.sourceUrl
      }
      const params = {
        news: {
          articles: [article]
        }
      }
      console.log(JSON.stringify(params))
      return this.$axios
        .post('/uploadNews', JSON.stringify(params))
        .then(res => {
          console.log(res)
          if (res.media_id) {
            alert('保存成功')
            return res.media_id
          }
        })
    },
    // 保存并群发
    saveAndSend () {
      const _this = this

      this.saveNews().then(mediaId => {
        const params = {
          mediaId: mediaId,
          receivers: this.$refs.fans.selectTagId === 0 ? true : this.$refs.fans.selectTagId + ''
        }
        _this.$axios.post('/massSendNews', params).then(res => {
          if (res.errcode === 0) {
            alert('发送成功')
          }
        })
      })
    },

    // 获取图文素材
    getNews () {
      const news = sessionStorage.getItem('news')
      const _this = this
      if (news) {
        _this.newsList = JSON.parse(news)
        console.log(_this.newsList)
        _this.newsListShow = true
      } else {
        let params = {
          type: 'news', // 返回素材的类型: image, video, voice, news
          offset: 0, // 从全部素材的该位置处开始返回
          count: 20 // 返回素材的数量，取值1-20之间
        }
        this.$axios
          .post('/getMaterials', JSON.stringify(params))
          .then(res => {
            console.log(res)
            sessionStorage.setItem('news', JSON.stringify(res.data.item))
            _this.newsList = res.data.item
            _this.newsListShow = true
          })
          .catch(err => console.log(err))
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.message {
  display: flex;
  width: 900px;
  min-height: 100vh;
  margin-left: 100px;

  .fans {
    .fans-list {
      display: flex;
      flex-direction: column;

      .fans-item {
        display: flex;
        align-items: center;
        width: 360px;
        padding: 10px;
        border: 1px solid #ccc;

        .fans-avatar {
          height: 60px;
        }

        .fans-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          margin: 10px 10px 0;
        }

        .send-msg {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: 50px;
          margin-left: 30px;
        }
      }
    }
  }

  .msg {
    flex: 1;
    margin-left: 20px;

    .news-msg {
      .cover {
        .sel-cover-image {
          cursor: pointer;

          .cover-image {
            width: 160px;
            height: 100px;
          }

          .add-cover-image {
            display: flex;
            flex-direction: column;
            width: 160px;
            height: 100px;
            padding: 25px 0;
            color: #57a3f3;
            border: 1px dashed #57a3f3;
            box-sizing: border-box;
          }
        }
      }

      .editor {
        position: relative;
        z-index: 1;
      }
    }
  }
}

.ivu-modal {
  .ivu-modal-content {
    .iconfont {
      color: #ccc;
    }

    .active {
      color: #2d8cf0;
    }
  }
}
</style>
