import { type RouteRecordRaw, createRouter } from 'vue-router'
import { history, flatMultiLevelRoutes } from './helper'
import routeSettings from '@/config/route'

const Layouts = () => import('@/layouts/index.vue')
/**
 * 常驻路由
 * 除了 redirect/403/404/login 等隐藏页面，其他页面建议设置 Name 属性
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/403',
    component: () => import('@/views/error-page/403.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      hidden: true
    },
    alias: '/:pathMatch(.*)*'
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/userManagement',
    component: Layouts,
    name: 'userManagement',
    redirect: '/userManagement/user',
    meta: {
      title: '用户管理',
      svgIcon: 'user'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/index.vue'),
        name: 'user',
        meta: {
          title: '用户管理',
          keepAlive: true
        }
      },
      {
        path: 'prohibitedUsers',
        component: () => import('@/views/prohibitedUsers/index.vue'),
        name: 'prohibitedUsers',
        meta: {
          title: 'IP封禁与黑名单',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/',
    component: Layouts,
    redirect: '/commentManagement',
    children: [
      {
        path: 'commentManagement',
        component: () => import('@/views/commentManagement/index.vue'),
        name: 'commentManagement',
        meta: {
          title: '评论管理',
          svgIcon: 'comment',
          affix: true
        }
      }
    ]
  },
  {
    path: '/article',
    component: Layouts,
    name: 'article',
    redirect: '/article/articleManagement',
    meta: {
      title: '内容管理',
      svgIcon: 'article'
    },
    children: [
      {
        path: 'articleManagement',
        component: () => import('@/views/articleManagement/index.vue'),
        name: 'articleManagement',
        meta: {
          title: '文章管理',
          keepAlive: true
        }
      },
      {
        path: 'friendlyArticle',
        component: () => import('@/views/friendlyArticle/index.vue'),
        name: 'friendlyArticle',
        meta: {
          title: '交友内容管理',
          keepAlive: true
        }
      },
      {
        path: 'articleCatelog',
        component: () => import('@/views/articleCatelog/index.vue'),
        name: 'articleCatelog',
        meta: {
          title: '分类管理',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/task',
    component: Layouts,
    name: 'task',
    redirect: '/task/newbieTask',
    meta: {
      title: '奖励配置',
      svgIcon: 'prize'
    },
    children: [
      {
        path: 'newbieTask',
        component: () => import('@/views/newbieTask/index.vue'),
        name: 'newbieTask',
        meta: {
          title: '新手任务',
          keepAlive: true
        }
      },
      {
        path: 'dailyTasks',
        component: () => import('@/views/dailyTasks/index.vue'),
        name: 'dailyTasks',
        meta: {
          title: '日常任务',
          keepAlive: true
        }
      },
      {
        path: 'signInConfig',
        component: () => import('@/views/signInConfig/index.vue'),
        name: 'signInConfig',
        meta: {
          title: '签到配置',
          keepAlive: true
        }
      },
      {
        path: 'invitationConfig',
        component: () => import('@/views/invitationConfig/index.vue'),
        name: 'invitationConfig',
        meta: {
          title: '邀请配置',
          keepAlive: true
        }
      },
      {
        path: 'activationConfig',
        component: () => import('@/views/activationConfig/index.vue'),
        name: 'activationConfig',
        meta: {
          title: '激活配置',
          keepAlive: true
        }
      },
      {
        path: 'readTimeRewardSettings',
        component: () => import('@/views/readTimeRewardSettings/index.vue'),
        name: 'readTimeRewardSettings',
        meta: {
          title: '阅读计时奖励设置',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/payment',
    component: Layouts,
    name: 'payment',
    redirect: '/payment/goldFlow',
    meta: {
      title: '支付配置',
      svgIcon: 'payment'
    },
    children: [
      {
        path: 'goldFlow',
        component: () => import('@/views/goldFlow/index.vue'),
        name: 'goldFlow',
        meta: {
          title: '金币流水',
          keepAlive: true
        }
      },
      {
        path: 'cashOut',
        component: () => import('@/views/cashOut/index.vue'),
        name: 'cashOut',
        meta: {
          title: '提现列表',
          keepAlive: true
        }
      },
      {
        path: 'cashOutConfig',
        component: () => import('@/views/cashOutConfig/index.vue'),
        name: 'cashOutConfig',
        meta: {
          title: '提现配置',
          keepAlive: true
        }
      },
      {
        path: 'exchangeRate',
        component: () => import('@/views/exchangeRate/index.vue'),
        name: 'exchangeRate',
        meta: {
          title: '汇率设置',
          keepAlive: true
        }
      }
    ]
  }
  // {
  //   path: "/unocss",
  //   component: Layouts,
  //   redirect: "/unocss/index",
  //   children: [
  //     {
  //       path: "index",
  //       component: () => import("@/views/unocss/index.vue"),
  //       name: "UnoCSS",
  //       meta: {
  //         title: "UnoCSS",
  //         svgIcon: "unocss"
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/link",
  //   meta: {
  //     title: "外链",
  //     svgIcon: "link"
  //   },
  //   children: [
  //     {
  //       path: "https://juejin.cn/post/7089377403717287972",
  //       component: () => {},
  //       name: "Link1",
  //       meta: {
  //         title: "中文文档"
  //       }
  //     },
  //     {
  //       path: "https://juejin.cn/column/7207659644487139387",
  //       component: () => {},
  //       name: "Link2",
  //       meta: {
  //         title: "新手教程"
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/table",
  //   component: Layouts,
  //   redirect: "/table/element-plus",
  //   name: "Table",
  //   meta: {
  //     title: "表格",
  //     elIcon: "Grid"
  //   },
  //   children: [
  //     {
  //       path: "element-plus",
  //       component: () => import("@/views/table/element-plus/index.vue"),
  //       name: "ElementPlus",
  //       meta: {
  //         title: "Element Plus",
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: "vxe-table",
  //       component: () => import("@/views/table/vxe-table/index.vue"),
  //       name: "VxeTable",
  //       meta: {
  //         title: "Vxe Table",
  //         keepAlive: true
  //       }
  //     }
  //   ]
  // }
  // {
  //   path: "/menu",
  //   component: Layouts,
  //   redirect: "/menu/menu1",
  //   name: "Menu",
  //   meta: {
  //     title: "多级路由",
  //     svgIcon: "menu"
  //   },
  //   children: [
  //     {
  //       path: "menu1",
  //       component: () => import("@/views/menu/menu1/index.vue"),
  //       redirect: "/menu/menu1/menu1-1",
  //       name: "Menu1",
  //       meta: {
  //         title: "menu1"
  //       },
  //       children: [
  //         {
  //           path: "menu1-1",
  //           component: () => import("@/views/menu/menu1/menu1-1/index.vue"),
  //           name: "Menu1-1",
  //           meta: {
  //             title: "menu1-1",
  //             keepAlive: true
  //           }
  //         },
  //         {
  //           path: "menu1-2",
  //           component: () => import("@/views/menu/menu1/menu1-2/index.vue"),
  //           redirect: "/menu/menu1/menu1-2/menu1-2-1",
  //           name: "Menu1-2",
  //           meta: {
  //             title: "menu1-2"
  //           },
  //           children: [
  //             {
  //               path: "menu1-2-1",
  //               component: () => import("@/views/menu/menu1/menu1-2/menu1-2-1/index.vue"),
  //               name: "Menu1-2-1",
  //               meta: {
  //                 title: "menu1-2-1",
  //                 keepAlive: true
  //               }
  //             },
  //             {
  //               path: "menu1-2-2",
  //               component: () => import("@/views/menu/menu1/menu1-2/menu1-2-2/index.vue"),
  //               name: "Menu1-2-2",
  //               meta: {
  //                 title: "menu1-2-2",
  //                 keepAlive: true
  //               }
  //             }
  //           ]
  //         },
  //         {
  //           path: "menu1-3",
  //           component: () => import("@/views/menu/menu1/menu1-3/index.vue"),
  //           name: "Menu1-3",
  //           meta: {
  //             title: "menu1-3",
  //             keepAlive: true
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       path: "menu2",
  //       component: () => import("@/views/menu/menu2/index.vue"),
  //       name: "Menu2",
  //       meta: {
  //         title: "menu2",
  //         keepAlive: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/hook-demo",
  //   component: Layouts,
  //   redirect: "/hook-demo/use-fetch-select",
  //   name: "HookDemo",
  //   meta: {
  //     title: "Hook 示例",
  //     elIcon: "Menu",
  //     alwaysShow: true
  //   },
  //   children: [
  //     {
  //       path: "use-fetch-select",
  //       component: () => import("@/views/hook-demo/use-fetch-select.vue"),
  //       name: "UseFetchSelect",
  //       meta: {
  //         title: "useFetchSelect"
  //       }
  //     },
  //     {
  //       path: "use-fullscreen-loading",
  //       component: () => import("@/views/hook-demo/use-fullscreen-loading.vue"),
  //       name: "UseFullscreenLoading",
  //       meta: {
  //         title: "useFullscreenLoading"
  //       }
  //     },
  //     {
  //       path: "use-watermark",
  //       component: () => import("@/views/hook-demo/use-watermark.vue"),
  //       name: "UseWatermark",
  //       meta: {
  //         title: "useWatermark"
  //       }
  //     }
  //   ]
  // }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  // {
  //   path: "/permission",
  //   component: Layouts,
  //   redirect: "/permission/page",
  //   name: "Permission",
  //   meta: {
  //     title: "权限管理",
  //     svgIcon: "lock",
  //     roles: ["admin", "editor"], // 可以在根路由中设置角色
  //     alwaysShow: true // 将始终显示根菜单
  //   },
  //   children: [
  //     {
  //       path: "page",
  //       component: () => import("@/views/permission/page.vue"),
  //       name: "PagePermission",
  //       meta: {
  //         title: "页面权限",
  //         roles: ["admin"] // 或者在子导航中设置角色
  //       }
  //     },
  //     {
  //       path: "directive",
  //       component: () => import("@/views/permission/directive.vue"),
  //       name: "DirectivePermission",
  //       meta: {
  //         title: "指令权限" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
  //       }
  //     }
  //   ]
  // },
  {
    path: '/:pathMatch(.*)*', // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: '/404',
    name: 'ErrorPage',
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history,
  routes: routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(constantRoutes) : constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
