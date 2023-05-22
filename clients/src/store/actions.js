import axiosClient from '../utils/axiosClient.js';
// ? if you are not writing any filename then it will automatically fetch index file from that folder

export function login({ commit }, data) {
  commit('setUser', data);
  localStorage.setItem('isAuthenticated', true);
}
export function logout({ commit }) {
  console.log('Logout Button Called');
  commit('setUser', {});
  localStorage.removeItem('isAuthenticated');
}

function setPosts({ commit }, userId) {
  console.log('inside posts');
  axiosClient.get(`/post/?userId=${userId}`).then((response) => {
    commit('setPosts', response.data);
  });
}

export default { login, logout, setPosts };
