import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';
// import sourceData from '@/data.json';
// import { findById } from '@/helpers';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/thread/:id',
    name: 'thread',
    component: () => import('@/views/ThreadView.vue'),
    props: true,
    // beforeEnter: (to, from, next) => {
    //   // check if thread exists
    //   const threadExists = findById(sourceData.threads, to.params.id);

    //   // if exists continue
    //   if (threadExists) {
    //     return next();
    //   } else {
    //     // if doesn't exist redirect to not-found
    //     next({
    //       name: 'not-found',
    //       params: {
    //         pathMatch: to.path.substring(1).split('/'),
    //       },
    //       query: to.query,
    //       hash: to.hash,
    //     });
    //   }
    // },
  },
  {
    path: '/forum/:forumId/thread/create',
    name: 'threadCreate',
    component: () => import('@/views/ThreadCreateView.vue'),
    props: true,
  },
  {
    path: '/thread/:id/edit',
    name: 'threadEdit',
    component: () => import('@/views/ThreadEditView.vue'),
    props: true,
  },
  {
    path: '/category/:id',
    name: 'category',
    component: () => import('@/views/CategoryView.vue'),
    props: true,
  },
  {
    path: '/forum/:id',
    name: 'forum',
    component: () => import('@/views/ForumView.vue'),
    props: true,
  },
  {
    path: '/me',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { toTop: true, smoothScroll: true },
  },
  {
    path: '/me/edit',
    name: 'profileEdit',
    component: () => import('@/views/ProfileView.vue'),
    props: { edit: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
  },

  {
    path: '/signin',
    name: 'signIn',
    component: () => import('@/views/SignInView.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
  scrollBehavior(to) {
    const scroll = {};
    if (to.meta.toTop) scroll.top = 0;
    if (to.meta.smoothScroll) scroll.behavior = 'smooth';
    return scroll;
  },
});

router.beforeEach(() => {
  store.dispatch('unsubscribeAllSnapshots');
});

export default router;
