const state = {
  username: 'Ych',
};
const getters = {
  username: (state) => state.username,
};
const mutations = {
  setUsername(state, username) {
    state.username = username;
  },
};
const actions = {
  async initUserName({ commit, state }){
  	let val ='hellow';
  	commit('setUsername', val);
  }
};
export default { state, getters, mutations, actions };
