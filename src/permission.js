import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress
import 'nprogress/nprogress.css' // Progress
import {getToken} from '@/utils/auth' //
const whiteList = ['/login', '/404']
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {

    if (to.path === '/login') {
      next({path: '/'})
      NProgress.done()
    } else if (!store.getters.role) {
      store.dispatch('GetInfo').then(() => {
        next({...to})
      })
    } else {
      next()
    }
  } else if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    next('/login')
    NProgress.done()
  }
})
router.afterEach(() => {
  NProgress.done()
})
