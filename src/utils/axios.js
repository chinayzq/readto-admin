import axios from 'axios';
import router from '@/router/index';
import config from '~/config';
import { ElMessage } from 'element-plus';
// 这边由于后端没有区分测试和正式，姑且都写成一个接口。
axios.defaults.baseURL = config[import.meta.env.MODE].baseUrl;
// 携带 cookie，对目前的项目没有什么作用，因为我们是 token 鉴权
axios.defaults.withCredentials = true;
// 请求头，headers 信息
setHeaderToken(axios);
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
// 默认 post 请求，使用 application/json 形式
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 请求拦截器，内部根据返回值，重新组装，统一管理。
axios.interceptors.response.use(
  (res) => {
    if (!res) return;
    if (res?.data?.code === 401) {
      ElMessage({
        message: '登录失效，请重新登录！',
        type: 'warning',
      });
      setTimeout(() => {
        router.push({ path: '/login' });
      }, 2000);
    }
    if (res.data === 0) return res.data;
    if (res.data && res.config && res.headers && res.request) return res.data;
    return res;
    // return res.data;
  },
  (error) => {
    const response = error.response;
    if (!response) {
      //调不通，返回null
      return;
    }
    // const res = response.data;
    // 401:未登录;
    if (response.status === 401) {
      // 如果当前不在登录页面，则跳转登录页面
      const currentHref = location.href.replace('noPermission', '');
      window.location.href = `${
        config[import.meta.env.MODE].loginPath
      }?redirect=${currentHref}`;
    } else if (response.status === 403) {
      // 403:无权限访问
      //router.replace({path: '/403'})
      // res.errorMsg || response.status
      // Message({
      //   message: '操作被禁止，如有需要，请联系管理员',
      //   type: 'warning',
      //   duration: 2 * 1000,
      // });
    }
    return Promise.reject(error);
  }
);
function setHeaderToken(axios) {
  const currentToken = localStorage.getItem('diy-admin-token');
  if (currentToken) {
    axios.defaults.headers['token'] = currentToken;
  }
}
export default axios;
