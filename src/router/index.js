import { createRouter, createWebHistory } from 'vue-router'
import Query from '../views/Query.vue'
import Import from '../views/Import.vue'
import Login from '../views/Login.vue'
import BatchImport from '../views/BatchImport.vue'
import Register from '../views/Register.vue'

const routes = [
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/', redirect: '/query' },
  { path: '/query', name: 'query', component: Query, meta: { requiresAuth: true } },
  { path: '/import', name: 'import', component: Import, meta: { requiresAuth: true } },
  { path: '/batch_import', name: 'batchImport', component: BatchImport, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // 需要登录但没登录 -> 跳转登录页
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
