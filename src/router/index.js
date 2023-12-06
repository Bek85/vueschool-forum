import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/components/HomeView.vue"),
  },
];

const router = createRouter({ routes, history: createWebHistory() });

export default router;
