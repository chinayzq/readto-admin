import axios from '../utils/axios';
/**
 * 登录接口
 * @param
 */
export function loginRequest(params) {
  return axios.post('/login', params);
}
export function loginOutRequest(params) {
  return axios.post('/loginout', params);
}
