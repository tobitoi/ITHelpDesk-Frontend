import Vue from 'vue'
import Router from 'vue-router'
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading
/* layout */
import Layout from '../views/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)
export const constantRouterMap = [
  {path: '/login', component: _import('login/index'), hidden: true},
  {path: '/404', component: _import('404'), hidden: true},
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '',
    hidden: true,
    children: [{
      path: 'dashboard', component: _import('dashboard/admin/index')
    }]
  }
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard',
    name: '',
    meta: {title: 'functional module', icon: 'tree'},
    children: [
      {
        path: 'dashboard',
        component: _import('dashboard/admin/index'),
        meta: {title: 'Dashboard', icon: 'example'},

      },
    ]
  },
  {
     path: '/employee',
     component: Layout,
     redirect: '/employee/',
     name: '',
     meta: {title: 'Employee', icon: 'table'},
     children: [
      {
        path: '', name: 'Employee List', component: _import('employee/employee'), meta: {title: 'Employee List', icon: 'user'}, menu: 'employee'
      },
     ]
    },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/',
    name: '',
    meta: {title: 'User', icon: 'table'},
    children: [
      {
        path: '', name: '用户列表', component: _import('user/user'), meta: {title: 'User List', icon: 'user'}, menu: 'user'
      },
      {
        path: 'role',
        name: '权限管理',
        component: _import('user/role'),
        meta: {title: 'authority management', icon: 'password'},
        menu: 'role'
      },
    ]
  },
  {
   path: '/reporter',
   component: Layout,
   redirect: '/reporter/',
   name: '',
   meta: {title: 'Submit Problems', icon: 'table'},
   children: [
    {
      path: '', name: 'Reporter', component: _import('reporter/reporter'), meta: {title: 'Submit Problems ', icon: 'user'}, menu: 'Reporter'
    },
   ]
  },
  {
     path: '/quality',
     component: Layout,
     redirect: '/quality/',
     name: '',
     meta: {title: 'Quality', icon: 'table'},
     children: [
     {
        path: '', name: 'Quality List', component: _import('quality/quality'), meta: {title: 'Quality List', icon: 'user'}, menu: 'quality control'
     },
    ]
  },
  {
     path: '/master',
     component: Layout,
     redirect: '/master/',
     name: '',
     meta: {title: 'Master Data', icon: 'table'},
     children: [
     {
       path: '', name: 'Problems List',
       component: _import('master/problems'),
       meta: {title: 'Problems ', icon: 'user'},
       menu: 'Problems Management'
     },
     {
       path: 'sparepart', name: 'Sparepart List',
       component: _import('master/sparepart'),
       meta: {title: 'Sparepart ', icon: 'user'},
       menu: 'Sparepart Management'
     },
     {
        path: 'procces', name: 'Proccess List',
        component: _import('master/procces'),
        meta: {title: 'Proccess ', icon: 'user'},
        menu: 'Proccess Management'
     },
     {
        path: 'category',
        name: 'Tools Category List',
        component: _import('toolscategory/toolscategory'),
        meta: {title: 'Tools Category ', icon: 'user'},
        menu: 'tools category'
     },
     {
        path: 'tools',
        name: 'Tools List',
        component: _import('toolscategory/tools'),
        meta: {title: 'Tools', icon: 'user'},
        menu: 'tools management'
     },
    ]
   },
  {
     path: '/maintenance',
     component: Layout,
     redirect: '/maintenance/',
     name: '',
     meta: {title: 'Maintenance', icon: 'table'},
     children: [
      {
        path: '', name: 'Maintenance', component: _import('reporter/maintenance'), meta: {title: 'Maintenance ', icon: 'user'}
      },
     ]
    },
  {
      path: '/system',
      component: Layout,
      redirect: '/system/article',
      name: '功能模块',
      meta: {title: '功能模块', icon: 'tree'},
      children: [
        {
          path: 'article',
          name: '文章',
          component: _import('article/article'),
          meta: {title: '文章', icon: 'example'},
          menu: 'article'
        },
      ]
    },
  {path: '*', redirect: '/404', hidden: true}
]
