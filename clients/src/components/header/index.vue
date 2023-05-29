<template>
  <header class="header">
    <div class="logo-title">
      <span class="material-symbols-outlined"> rebase_edit </span>
      <span>Write-Pad</span>
    </div>
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search..."
        class="search-box"
        @input="searchPosts"
      />
    </div>
    <div
      class="search-dropdown"
      v-show="showDropdown && searchResults.length > 0"
      ref="dropdown"
    >
      <div v-for="post in searchResults" :key="post.id" class="search-result">
        <router-link
          router-link
          :to="{ name: 'post', params: { id: post?.id } }"
          >{{ truncateContent(post.content) }}</router-link
        >
      </div>
    </div>
  </header>
</template>

<script>
import axiosClient from '../../utils/axiosClient';

export default {
  name: 'Header',
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      allPosts: [],
      showDropdown: false,
    };
  },
  async created() {
    try {
      const response = await axiosClient.get(`/post`);
      this.allPosts = response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    async searchPosts() {
      // Perform search logic
      const query = this.searchQuery.toLowerCase().trim();
      const filteredPosts = this.allPosts.filter((post) => {
        const contentMatch = post.content.toLowerCase().includes(query);
        const tagsMatch = post.tags.some((tag) =>
          tag.toLowerCase().includes(query),
        );
        return contentMatch || tagsMatch;
      });
      this.searchResults = filteredPosts.slice(0, 10);
      this.showDropdown = true; // Show the dropdown when there are search results
    },
    handleClickOutside(event) {
      if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
        this.showDropdown = false; // Hide the dropdown when clicking outside
      }
    },
    // Truncate post content to 20 words followed by ellipsis (...)
    truncateContent(content) {
      const words = content.split(' ');
      if (words.length > 20) {
        return words.slice(0, 20).join(' ') + '...';
      }
      return content;
    },
  },
};
</script>

<style scoped>
@import './header.style.css';

.search-dropdown {
  position: absolute;
  max-width: 60%;
  background-color: whitesmoke;
  top: 3em;
  left: 19em;
  z-index: 999;
  padding: 2px;
}

.search-result {
  padding: 4px 2px;
  border-bottom: 1px solid grey;
}
.search-result:hover {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}
</style>
