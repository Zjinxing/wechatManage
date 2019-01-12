import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './http/axios'
import 'iview/dist/styles/iview.css'
import './assets/style/index.styl'
import { Modal, Upload, Button, Layout, Sider, Content, Row, Col, Menu, MenuItem, MenuGroup, Submenu, Icon, Card, Input, RadioGroup, Radio, Select, Option, Tabs, TabPane } from 'iview'

Vue.config.productionTip = false
Vue.prototype.$axios = axios

Vue.component('Modal', Modal)
Vue.component('Upload', Upload)
Vue.component('Button', Button)
Vue.component('Layout', Layout)
Vue.component('Sider', Sider)
Vue.component('Content', Content)
Vue.component('Row', Row)
Vue.component('i-col', Col)
Vue.component('Menu', Menu)
Vue.component('MenuItem', MenuItem)
Vue.component('Submenu', Submenu)
Vue.component('MenuGroup', MenuGroup)
Vue.component('Icon', Icon)
Vue.component('Card', Card)
Vue.component('i-input', Input)
Vue.component('Radio-group', RadioGroup)
Vue.component('Radio', Radio)
Vue.component('Select', Select)
Vue.component('Option', Option)
Vue.component('Tabs', Tabs)
Vue.component('TabPane', TabPane)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
