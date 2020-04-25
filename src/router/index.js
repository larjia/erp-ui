import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

// 解决Uncaught (in promise) exception: undefined
// https://blog.csdn.net/weixin_43202608/article/details/98884620
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)
import Layout from '@/layout'

/**
 * Note: 路由配置项
 * 
 * hidden: true                  // 当设置true的时候该路由不会在侧边栏出现 如404,login等页面, 或者如一些编辑页面/edit/1 
 * alwaysShow: true              // 当一个路由下面的children声明的路由大于1个时,自动会变成嵌套的模式 如组件页面
 *                               // 只有一个时,会将那个子路由当做根路由显示在侧边栏 如引导页面
 *                               // 若想不管路由下面的children声明的个数都显示根路由
 *                               // 你可以设置alwaysShow: ture,这样就会忽略之前定义的规则,一直显示根路由
 * redirect: noRedirect          // 当设置noRedirect的时候该路由在面包屑中不可被点击
 * name: 'router-name'           // 设定路由的名字,一定要填写不然使用<keep-alive>时会出现各种问题
 * meta: {
 *  roles: ['admin', 'editor']   // 设置该路由进入的权限,支持多个权限叠加
 *  title: 'title'               // 设置该路由在侧边栏的面包屑中展示的名字
 *  icon: 'svg-name'             // 设置该路由的图标,对应路径src/icons/svg
 *  breadcrumb: false            // 如果设置为false, 则不会在breadcrumb面包屑中显示
 * }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true } // affix: 若为true则在tagsView中始终显示
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  }
  // {
  //   path: '/masterdata/supplier',
  //   component: Layout,
  //   redirect: 'add',
  //   children: [
  //     {
  //       path: 'add',
  //       component: () => import('@/views/masterdata/supplier/AddSupplier'),
  //     }
  //   ]
  // }
]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

export default router
