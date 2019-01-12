<template>
  <div class="material">
    <Tabs value="news" @on-click="getImageMaterials">
      <TabPane name="news" label="图文素材">
        图文素材……
      </TabPane>
      <TabPane name="image" label="图片素材">
        <Card>
          <p slot="title">
            图片素材
          </p>
          <template slot="extra">
            <input type="file" id="file">
            <Button @click="upload">上传</Button>
          </template>
          <Row type="flex">
            <i-col v-for="item in imageList" :key="item.media_id">
              <Card>
                <p slot="title" style="width: 140px">{{item.name}}</p>
                <div style="width: 140px; height: 140px">
                  <img :src="item.url" alt="" width="140">
                </div>
              </Card>
            </i-col>
          </Row>
        </Card>
      </TabPane>
      <TabPane name="voice" label="语音素材">
        语音素材
      </TabPane>
      <TabPane name="video" label="视频素材">
        视频素材
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
export default {
  name: 'material',
  data () {
    return {
      imageList: [],
      voiceList: [],
      videoList: [],
      newsList: []
    }
  },
  computed: {

  },
  methods: {
    getImageMaterials (tab) {
      console.log(tab)
      const _this = this
      const list = sessionStorage.getItem(tab)
      if (list && list !== 'undefined') {
        this[tab + 'List'] = JSON.parse(list)
        console.log('from session: ', this[tab + 'List'])
      } else {
        let params = {
          type: tab, // 返回素材的类型: image, video, voice, news
          offset: 0, // 从全部素材的该位置处开始返回
          count: 20 // 返回素材的数量，取值1-20之间
        }
        this.$axios.post('/getMaterials', JSON.stringify(params))
          .then(res => {
            console.log(res)
            // 对图片素材URL进行处理，否则显示“此图片来自微信公众平台，未经允许不可引用”
            res.data.item.forEach(item => {
              item.url = 'http://img01.store.sogou.com/net/a/04/link?appid=100520029&url=' + item.url
            })            
            sessionStorage.setItem(tab, JSON.stringify(res.data.item))
            _this[tab + 'List'] = res.data.item
          })
      }
    },
    upload() {
      let dom = document.getElementById('file')
      const file = dom.files[0]
      console.log(file)
      if(file) {
        let formData = new FormData()
        formData.append('file', file)
        this.$axios.post('/uploadImageMaterial', formData).then(res => {
          console.log(res)
        })
      } else {
        alert ('未选择任何文件')
      }
    },
  }
}
</script>

<style lang="stylus" scoped>
.material
  margin-left 80px
</style>
