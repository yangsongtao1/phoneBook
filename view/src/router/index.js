import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {requireAuth: true},
      component: () => import('@/pages/index'),
      children: [
        {
          path: '/phonelist',
          name: 'booklist',
          meta: {requireAuth: true},
          component: () => import('@/pages/phonelist'),
        },
        {
          path: '/info/:id',
          name: 'info',
          meta: {requireAuth: true},
          component: () => import('@/pages/booklistInfo')
        },
        {
          path: '/charts',
          name: 'charts',
          meta: {requireAuth: true},
          component: () => import('@/pages/echarts'),
        },
        {
          path: '/notelist',
          name: 'notelist',
          meta: {requireAuth: true},
          component: () => import('@/pages/notelist'),
        },
      ],
      redirect: '/phonelist'
    },
    {
      path: '/changePw',
      name: 'changePw',
      meta: {requireAuth: true},
      component: () => import('@/pages/changePw')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/register')
    },
    {
      path: '/forgetPw',
      name: 'forgetPw',
      component: () => import('@/pages/forgetPw')
    },
    {
      path: '/person',
      name: 'person',
      component: () => import('@/pages/person')
    }
  ]
})
router.beforeEach((to, from, next) => {
  console.log(to, from)
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (store.state.users.token === '') { // 判断本地是否存在access_token
      next('/login')
    } else {
      // 未登录,跳转到登陆页面，并且带上 将要去的地址，方便登陆后跳转。
      next()
    }
  } else {
    next()
  }
})
export default router
