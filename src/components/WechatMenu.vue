<template>
  <div class="menu">
    <div class="menu-phone">
      <div class="phone-header">
        <img src="../assets/images/bg-mobile-head-default.png" alt="">
      </div>
      <Icon type="navicon"></Icon>
      <div class="phone-foot">
        <Row type="flex" justify="space-around" align="middle">
          <i-col v-for="item in menu.button" :key="item.name">
            <ul v-if="item.sub_button" class="sub-buttons">
              <li
                class="button-item"
                v-for="subItem in item.sub_button"
                :key="subItem.name"
                @click="chooseMenu($event, subItem.type)">
                {{subItem.name}}
              </li>
              <li class="add-button" v-if="item.sub_button.length < 5">
                <Button size="small"><i class="iconfont icon-add"></i>添加菜单</Button>
              </li>
            </ul>
            <i class="iconfont icon-navicon" v-if="item.sub_button"></i>
            {{item.name}}
          </i-col>
          <i-col v-if="menu.button && menu.button.length < 3">
            <i class="iconfont icon-add"></i>添加菜单
          </i-col>
        </Row>
      </div>
    </div>
    <div class="menu-detail">
      <Card>
        <p slot="title" style="text-align: left">当前菜单</p>
        <Button slot="extra" type="primary">删除当前菜单</Button>
        <div class="menu-name">
          <i-input>
            <span slot="prepend">菜单名称</span>
          </i-input>
          <span class="tips">一级菜单最多4个汉字，二级菜单最多7个汉字，超出部分将会以“…”代替</span>
        </div>
        <div class="menu-type">
          <p class="title">按钮类型</p>
          <Radio-group v-model="currentType" class="radio-group">
            <Radio v-for="item in menuType" :key="item.type" :label="item.type">
              {{item.value}}
            </Radio>
          </Radio-group>
        </div>
        <div class="menu-response">
          <Card v-if="currentType==='click'">
            <p slot="title">响应内容</p>
            <div class="click-button">
              <i-input v-model="key">
                <span slot="prepend">请填写附带key</span>
              </i-input>
              <span class="tips">请填写点击事件附带的key</span>
            </div>
          </Card>
          <Card v-if="currentType==='view'">
            <p slot="title">请填写URL</p>
            <div class="view-button">
              <i-input v-model="url">
                <span slot="prepend">跳转URL</span>
              </i-input>
              <span class="tips">请输入将要跳转的URL</span>
            </div>
          </Card>
          <Card v-if="currentType==='scancode_push'">
            <p slot="title">回复内容</p>
            <p>菜单内容为扫码，点击这个菜单将会调起微信扫一扫功能</p>
            <Button>触发关键字</Button>
          </Card>
          <Card v-if="currentType==='scancode_waitmsg'">
            <p slot="title">回复内容</p>
            <p>菜单内容为扫码，点击这个菜单将会调起微信扫一扫功能，扫码完毕弹出“消息接收中”</p>
            <Button>触发关键字</Button>
          </Card>
          <Card v-if="currentType==='pic_sysphoto'">
            <p slot="title">回复内容</p>
            <p>点击这个菜单将会调起手机拍照，完成拍照将会发送照片给服务器</p>
            <Button>触发关键字</Button>
          </Card>
          <Card v-if="currentType==='pic_photo_or_album'">
            <p slot="title">回复内容</p>
            <p>点击这个菜单将会弹出拍照或相册发图</p>
            <Button>触发关键字</Button>
          </Card>
          <Card v-if="currentType==='pic_weixin'">
            <p slot="title">回复内容</p>
            <p>点击这个菜单将会触发从相册选择图片</p>
            <Button>触发关键字</Button>
          </Card>
          <Card v-if="currentType==='location_select'">
            <p slot="title">回复内容</p>
            <p>点击这个菜单将会触发地理位置选择器</p>
            <Button>触发关键字</Button>
          </Card>
          <Card v-if="currentType==='media_id'">
            <p slot="title">回复内容</p>
            <p>点击这个菜单将会发送相应的素材给用户，素材可以是图片、音频、视频、图文消息</p>
            <Button>选择素材</Button>
          </Card>
          <Card v-if="currentType==='miniprogram'">
            <p slot="title">回复内容</p>
            <p>点击这个菜单将会跳转到相应的小程序</p>
            <div class="appid">
              <i-input placeholder="请填写小程序的appid">
                <span slot="prepend" style="display: inline-block;width: 100px; text-align: center">APPID</span>
              </i-input>
              <br>
              <i-input placeholder="请填写跳转小程序的访问路径">
                <span slot="prepend" style="display: inline-block;width: 100px; text-align: center">页面</span>
              </i-input>
              <br>
              <i-input placeholder="请填写跳转小程序的访问路径">
                <span slot="prepend" style="display: inline-block;width: 100px; text-align: center">备用网页</span>
              </i-input>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import axios from '../http/axios'

export default {
  name: 'wechatMenu',
  data () {
    return {
      selectMenu: '',
      url: '',
      key: '',
      menu: {},
      currentType: 'click',
      menuType: [
        { type: 'click', value: '点击类型' },
        { type: 'view', value: '跳转网页' },
        { type: 'scancode_push', value: '扫码推事件' },
        { type: 'scancode_waitmsg', value: '扫码(等待消息)' },
        { type: 'pic_sysphoto', value: '拍照发图' },
        { type: 'pic_photo_or_album', value: '拍照或相册' },
        { type: 'pic_weixin', value: '相册选图' },
        { type: 'location_select', value: '地理位置' },
        { type: 'media_id', value: '发送消息' },
        // { type: 'view_limited', value: '图文消息' },
        { type: 'miniprogram', value: '跳转小程序' }
      ]
    }
  },
  created () {
    const _this = this
    this.$nextTick(() => {
      axios.get('/getMenu').then(res => {
        console.log(res.data)
        _this.menu = res.data.menu
      })
    })
  },
  methods: {
    chooseMenu (e, value) {
      console.log(value)
      this.currentType = value
    }
  }
}
</script>

<style lang="stylus" scoped>
.menu
  display flex
  .menu-phone
    position relative
    width 320px
    height 568px
    margin 10px 60px
    // outline 1px dashed #f00
    .phone-header
      position absolute
      left 0
      top 0
    .phone-foot
      position absolute
      left 0
      bottom 0
      width 320px
      height 50px
      border 1px solid #dcdcdc
      background-image url("../assets/images/bg-mobile-foot-default.png")
      .ivu-row-flex
        position absolute
        right 0
        bottom 0
        width 276px
        min-height 50px
        line-height 50px
        .sub-buttons
          .button-item
            text-align center
            max-width 92px
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
            cursor pointer
  .menu-detail
    width 650px
    .menu-name
      .tips
        font-size 12px
        color #999
    .menu-type
      display flex
      margin 10px 0
      .title
        width 100px
        margin-right 15px
      .radio-group
        text-align left
        .ivu-radio-group-item
          margin 5px 10px 0 0
//
</style>
