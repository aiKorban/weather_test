import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import CityView from '@/views/CityView.vue'

const routes = [
  { path: "/", name: "home", component: HomeView, meta: { title: "Home" } },
  { path: "/weather/:state/:city", name: "cityView", component: CityView, meta: { title: "Weather" } },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// router.beforeEach():
// This is a global navigation guard in Vue Router. It is triggered before every navigation, meaning it runs whenever you navigate to a new route.
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | The Local Weather`;
  next();
});

export default router
