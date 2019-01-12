<template>
  <div class="fans">
    <Row type="flex" align="middle">
      <i-col>请选择群分组</i-col> &nbsp;
      <i-col>
        <Select v-model="selectTagId" placeholder="请选择发送对象" style="width: 100px" size="small">
          <Option :value="0">
            所有
          </Option>
          <Option v-for="tag in tags" :key="tag.id" :value="tag.id">
            {{tag.name}}
          </Option>
        </Select>
      </i-col>
    </Row>
    <ul class="fans-list">
      <li class="fans-item" v-for="(fans, index) in selFanList" :key="fans.nickname">
        <img class="fans-avatar" :src="fans.headimgurl" alt="">
        <div class="fans-info">
          <span class="nickname">{{fans.nickname}}</span>
          <span class="index">{{index + 1}}</span>
          <span class="tags-name">{{fans.groupid | getTagName}}</span>
        </div>
        <div class="send-msg">
          <a href="javascript:;">发送消息 &gt;</a>
          <span class="subscribe-time">关注时间：{{fans.subscribe_time | formatTime}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'fansList',
  data () {
    return {
      selectTagId: 0, // 选中的标签
      fansList: [], // 粉丝列表
      openids: [], // 粉丝openid列表
      tags: [] // 公众号标签列表
    }
  },
  computed: {
    selFanList () {
      // 标签为0时返回所有用户
      if (this.selectTagId === 0) {
        return this.fansList
      }
      return this.fansList.filter(item => {
        return item.groupid === this.selectTagId
      })
    }
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
      const M = date.getMonth() + 1
      const D = date.getDate()
      const H = date.getHours()
      const m = date.getMinutes()
      return `${Y}-${M}-${D}  ${H}:${m}`
    }
  },
  created () {
    const _this = this
    this.$nextTick(() => {
      const fansList = sessionStorage.getItem('fansList')
      const tags = sessionStorage.getItem('tags')
      const openids = sessionStorage.getItem('openids')
      if (fansList && fansList !== 'undefined') {
        _this.fansList = JSON.parse(fansList)
      } else {
        // 获取粉丝列表
        _this.$axios.get('/getFollowers').then(res => {
          console.log(res.data.data.openid)
          _this.fansOpenId = res.data.data.openid
          // 接口调用次数有限，将信息存到sessionStorage
          sessionStorage.setItem('openids', JSON.stringify(_this.openids))
          return res.data.data.openid
        }).then(res => {
          let params = { openids: res }
          _this.$axios.post('/batchGetUsers', JSON.stringify(params)).then(res => {
            // console.log(res.data.user_info_list)
            _this.fansList = res.data.user_info_list
            // 接口调用次数有限，将信息存到sessionStorage
            sessionStorage.setItem('fansList', JSON.stringify(_this.fansList))
          })
        })
      }
      if (tags && tags !== 'undefined') {
        _this.tags = JSON.parse(tags)
      } else {
        // 获取标签列表
        _this.$axios.get('/getTags').then(res => {
          console.log(res.data.tags)
          _this.tags = res.data.tags
          // 接口调用次数有限，将信息存到sessionStorage
          sessionStorage.setItem('tags', JSON.stringify(_this.tags))
        })
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
.fans
  .fans-list
    display flex
    flex-direction column
    .fans-item
      display flex
      align-items center
      width 360px
      padding 10px
      border 1px solid #ccc
      .fans-avatar
        height 60px
      .fans-info
        display flex
        flex-direction column
        justify-content space-between
        height 100%
        margin 10px 10px 0
      .send-msg
        display flex
        flex-direction column
        justify-content space-around
        height 50px
        margin-left 30px
</style>
