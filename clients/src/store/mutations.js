export function setUser(state, userInfo) {
  state.user = { ...userInfo, isAuthenticated: true };
}

export function setPosts(state, posts) {
  state.posts = posts;
}

export function saveToSession(state, { key, data }) {
  state.sessionData = data;
}

export default { setUser, setPosts, saveToSession };
