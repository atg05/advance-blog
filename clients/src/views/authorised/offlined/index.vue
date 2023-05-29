<template>
  <div class="articles-container">
    <div v-if="offlinedPosts.length > 0" class="post-list">
      <div v-for="post in offlinedPosts" :key="post.id" class="post">
        <Post :post="post" />
      </div>
    </div>
    <div v-else class="no-posts-message">No posts downloaded.</div>
  </div>
</template>

<script>
import Post from '../../../components/post/index.vue';

export default {
  name: 'Offlined',
  components: {
    Post,
  },
  data() {
    return {
      offlinedPosts: [],
    };
  },
  created() {
    // Fetch offlined data from localStorage based on userId
    // and store it in the offlinedPosts array.
    this.getOfflinedPosts();
  },
  methods: {
    getOfflinedPosts() {
      const userId = this.$store.state.user.id;
      this.offlinedPosts = JSON.parse(localStorage.getItem(userId)) || [];
    },
  },
};
</script>

<style></style>
