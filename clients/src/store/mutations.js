export function setUser(state, userInfo) {
  state.user = { ...userInfo, isAuthenticated: true };
}

export function setPosts(state, posts) {
  state.posts = posts;
}

export default { setUser, setPosts };
