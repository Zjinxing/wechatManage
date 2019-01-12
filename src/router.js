import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/home/menu',
          name: 'menu',
          component: () => import('./components/WechatMenu.vue')
        },
        {
          path: '/home/fans',
          name: 'fans',
          component: () => import('./components/FansManage.vue')
        },
        {
          path: '/home/message',
          name: 'message',
          component: () => import('./components/Message.vue')
        },
        {
          path: '/home/material',
          name: 'material',
          component: () => import('./components/Material.vue')
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
