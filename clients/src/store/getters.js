export default {
  isAuthenticated(state) {
    return state.user || null;
  },
  getUserInfo(state) {
    return state.user;
  },
  getAllPosts(state) {
    return state.posts;
  },
};
