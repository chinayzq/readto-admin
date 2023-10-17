import axios from '../utils/axios';
export function getStickerList(params) {
  return axios.get('/listphonesticker', { params });
}
export function getStickerDetails(params) {
  return axios.get('/phonesticker', { params });
}
export function deletePhoneSticker(params) {
  return axios.delete('/deletephonesticker', { params });
}
export function createPhoneSticker(params) {
  return axios.post('/createphonesticker', params);
}

// export function getPhoneColor(params) {
//   return axios.get('/listphonecolor', { params });
// }
