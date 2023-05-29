<template>
  <div class="articles-container">
    <div v-if="userPosts.length > 0" class="post-list">
      <div v-for="post in userPosts" :key="post.id" class="post">
        <Post :post="post" />
      </div>
    </div>
    <div v-else class="no-posts-message">
      No posts available in the reading session.
    </div>
  </div>
</template>

<script>
import Post from '../../../components/post/index.vue';
export default {
  name: 'ReadingSession',
  components: { Post },
  computed: {
    userPosts() {
      const currentUserId = this.$store.state.user.id;
      const postData = sessionStorage.getItem(currentUserId);
      if (postData) {
        return JSON.parse(postData);
      } else {
        return [];
      }
    },
  },
};
</script>

<style></style>
