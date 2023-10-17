import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
// # 引入 vue3-lazy, 图片懒加载
import vueLazyLoad from 'vue3-lazy';
import { initGlableFilters } from './utils';
import * as ElIconModules from '@element-plus/icons-vue';
const app = createApp(App);
for (const name in ElIconModules) {
  app.component(name, ElIconModules[name]);
}
// 全局过滤器
initGlableFilters(app);

// element
import ElementPlus from 'element-plus';
import zhCN from 'element-plus/dist/locale/zh-cn.mjs'; //引入中文
import 'element-plus/dist/index.css';
app.use(ElementPlus, { locale: zhCN });
import './assets/css/base.less';
import './assets/css/index.less';

// vuex
import vuex from '@/vuex';
app.use(vuex);
app.config.globalProperties.$vuex = vuex;

app.use(vueLazyLoad, {
  loading: new URL('./assets/images/img_loading.svg', import.meta.url),
  error: new URL('./assets/images/img_error.png', import.meta.url),
});
app.use(router);

app.mount('#app');
