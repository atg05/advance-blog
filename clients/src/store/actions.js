import axiosClient from '../utils/axiosClient.js';
// ? if you are not writing any filename then it will automatically fetch index file from that folder

export function login({ commit }, data) {
  commit('setUser', data);
  localStorage.setItem('isAuthenticated', true);
}
export function logout({ commit, rootState }) {
  sessionStorage.removeItem(rootState.user.id);
  commit('setUser', {});
  localStorage.removeItem('isAuthenticated');
}

function setPosts({ commit }, userId) {
  axiosClient.get(`/post/?userId=${userId}`).then((response) => {
    commit('setPosts', response.data);
  });
}

export function saveToSession({ commit, rootState }, { post }) {
  const currentUserId = rootState.user.id;
  const existingData = JSON.parse(sessionStorage.getItem(currentUserId)) || [];
  const postExists = existingData.some(
    (existingPost) => existingPost.id === post.id,
  );

  if (!postExists) {
    const mergedData = [...existingData, post];
    sessionStorage.setItem(currentUserId, JSON.stringify(mergedData));
    commit('saveToSession', { key: currentUserId, data: mergedData });
    alert('Added to reading session!');
  } else {
    alert('Already added to reading session!');
  }
}

export default { login, logout, setPosts, saveToSession };
