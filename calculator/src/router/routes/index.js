export const basicRoutes = [
  // 展示页
  {
    path: "/",
    name: "/",
    component: () => import("@/views/index.vue"),
    meta: {
      title: "首页",
      hidden: false,
      icon: "DashboardOutlined"
    },
    children: []
  },
  {
    name: "404",
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      isHidden: true
    }
  },
  {
    name: "NotFound",
    path: "/:pathMatch(.*)*",
    redirect: "/404",
    meta: {
      hidden: true
    }
  }
]
