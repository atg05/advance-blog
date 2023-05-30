<template>
  <div class="feed_container">
    <!-- <Editor /> -->
    <div class="filter-container">
      <TagCard @click="filterPostsByTag(null)">All</TagCard>
      <TagCard
        v-for="tag in uniqueTags"
        :key="tag"
        @click="filterPostsByTag(tag)"
        >{{ tag }}</TagCard
      >
    </div>

    <div v-if="filteredPosts.length > 0" class="post-list">
      <div v-for="post in filteredPosts" :key="post.id" class="post">
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
import { mapState } from 'vuex';
import store from '../../../store';

export default {
  name: 'Feed',
  components: {
    Post,
    Editor,
    TagCard,
  },

  data() {
    return {
      selectedTag: null,
    };
  },

  computed: {
    ...mapState(['user', 'posts']),
    uniqueTags() {
      const tagsSet = new Set();
      this.posts.forEach((post) => {
        post.tags.forEach((tag) => {
          if (tag !== '') tagsSet.add(tag);
        });
      });
      console.log(tagsSet);
      return Array.from(tagsSet);
    },
    filteredPosts() {
      if (this.selectedTag) {
        return this.posts.filter((post) =>
          post.tags.includes(this.selectedTag),
        );
      }
      return this.posts;
    },
  },

  methods: {
    filterPostsByTag(tag) {
      this.selectedTag = tag;
    },
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
