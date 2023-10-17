import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from '@/views/layout/index.vue';
const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      component: Layout,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { title: '首页' },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: { title: '登录' },
    },
  ],
});
router.beforeEach((to, from, next) => {
  next();
});
export default router;
