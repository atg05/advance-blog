export function setUser(state, userInfo) {
  console.log('inside setUser', userInfo);
  state.user = { ...userInfo, isAuthenticated: true };
}

export function setPosts(state, posts) {
  console.log(posts, 'mutations');
  state.posts = posts;
}

export default { setUser, setPosts };
