import axios from '../utils/axios';
export function getDictionaryList(params) {
  return axios.get('/dict/listclass', params);
}
export function getItemByClassId(params) {
  return axios.get('/dict/listitem', { params });
}
export function deleteClassById(params) {
  return axios.delete('/dict/deleteclass', { params });
}
export function addDictionary(params) {
  return axios.post('/dict/createclass', params);
}
export function updateDictionaryClass(params) {
  return axios.post('/dict/updateclass', params);
}
export function editDictionary(params) {
  return axios.post('/dict/edititem', params);
}
