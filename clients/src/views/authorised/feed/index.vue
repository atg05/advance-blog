<template>
  <div class="feed_container">
    <!-- <Editor /> -->
    <div class="filter-container">
      <TagCard>All</TagCard>
      <TagCard>Technology</TagCard>
      <TagCard>Cooking</TagCard>
      <TagCard>Self-Help</TagCard>
    </div>

    <div v-if="posts.length > 0" class="post-list">
      <div v-for="post in posts" :key="post.id" class="post">
        <Post :post="post" />
      </div>
    </div>
    <div v-else class="no-posts">No posts yet.</div>
  </div>
</template>

<script>
import Post from '../../../components/post/index.vue';
import Editor from '../../../components/editor/index.vue';
import TagCard from '../../../components/tags/card.vue';
import { mapGetters, mapState } from 'vuex';
import store from '../../../store';

export default {
  name: 'Feed',
  components: {
    Post,
    Editor,
    TagCard,
  },

  computed: {
    ...mapState(['user', 'posts']),
    ...mapGetters(['getAllPosts']), // Import the user state from Vuex
  },
  async created() {
    store.dispatch('setPosts', this.user.id);
  },
};
</script>

<style>
@import './feed.style.css';
main {
  grid-area: 'main';
}
.filter-container {
  display: flex;
  gap: 0.5em;
}
</style>
