<template>
  <div class="home">
    <Layout class="layout">
      <Header>header</Header>
      <Layout class="content">
        <Sider style="background: rgba(0,0,0,0)">
          <Menu theme="dark">
            <Submenu name="1">
              <template slot="title">
                消息管理
              </template>
              <router-link to="/home/message">
                <MenuItem name="1-1">群发消息</MenuItem>
              </router-link>
              <MenuItem name="1-2">当前菜单</MenuItem>
              <MenuItem name="1-3">删除菜单</MenuItem>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                菜单管理
              </template>
              <router-link to="/home/menu">
                <MenuItem name="2-1">创建菜单</MenuItem>
              </router-link>
              <MenuItem name="2-2">当前菜单</MenuItem>
              <MenuItem name="2-3">删除菜单</MenuItem>
            </Submenu>
            <Submenu name="3">
              <template slot="title">
                用户管理
              </template>
              <router-link to="/home/fans">
                <MenuItem name="3-1">用户备注</MenuItem>
              </router-link>
            </Submenu>
          </Menu>
        </Sider>
        <Content>
          <router-view></router-view>
        </Content>
      </Layout>
      <Footer>footer</Footer>
    </Layout>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
  data () {
    return {}
  },
  components: {}
}
</script>

<style lang="stylus" scoped>
  .home
    .layout
      min-height 100vh
      .ivu-layout-content
        width 900px
</style>
