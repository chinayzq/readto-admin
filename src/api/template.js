import axios from '../utils/axios';
export function getTemplateList(params) {
  return axios.get('/listtemplate', { params });
}
export function deleteTemplate(params) {
  return axios.delete('/deletetemplate', { params });
}
export function updateTemplate(params) {
  return axios.post('/edittemplate', params);
}
export function getTemplateDetail(params) {
  return axios.get('/template', { params });
}
