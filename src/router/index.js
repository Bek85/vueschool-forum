import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/components/HomeView.vue'),
    children: [
      {
        path: 'thread/:id',
        name: 'thread',
        component: () => import('@/components/ThreadView.vue'),
        props: true,
      },
    ],
  },
];

const router = createRouter({ routes, history: createWebHistory() });

export default router;
