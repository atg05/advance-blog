export default {
  isAuthenticated(state) {
    console.log(state.user);
    return state.user || null;
  },
  getUserInfo(state) {
    return state.user;
  },
  getAllPosts(state) {
    return state.posts;
  },
};
