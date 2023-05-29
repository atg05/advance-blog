<template>
  <form @submit.prevent="submitPost" enctype="multipart/form-data">
    <textarea
      class="editor"
      placeholder="Write your thoughts here!"
      name="blog_post"
      v-model="blog_post"
    />

    <div class="action-buttons-container">
      <div class="dropdown-container">
        <div class="dropdown">
          <div class="dropdown-button" @click="toggleDropdown">Category</div>
          <div class="dropdown-menu" v-show="showDropdown">
            <div class="add-box">
              <input
                type="text"
                v-model="category"
                placeholder="Custom Category"
              />
              <span
                class="material-symbols-outlined icon"
                @click="createCategory"
              >
                add
              </span>
            </div>
            <ul>
              <li
                v-for="category in categories"
                :key="category"
                @click="selectCategory(category)"
              >
                {{ category }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <label for="fileInput" class="image-upload-button">
          <span class="upload-icon">+ Upload Image</span>
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileUpload"
          ref="fileInput"
          style="display: none"
        />
      </div>
      <Button type="submit" class="post-button">Post</Button>
    </div>
  </form>
</template>

<script>
import Button from '../atoms/button/index.vue';
import { mapState } from 'vuex';
import axiosClient from '../../utils/axiosClient';

export default {
  components: {
    Button,
  },
  data() {
    return {
      blog_post: '',
      selectedImage: null,
      showDropdown: false,
      selectedCategory: '',
      category: '',
      categories: [], // Add your categories here
    };
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    async submitPost() {
      const formData = new FormData();
      formData.append('content', this.blog_post);
      formData.append('authorId', this.user.id);
      formData.append('category', this.selectedCategory);
      if (this.selectedImage) {
        formData.append('image', this.selectedImage, this.selectedImage.name);
      }

      try {
        const response = await axiosClient
          .post('/post', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(() => {
            this.blog_post = '';
            this.selectedImage = null;
            this.selectedCategory = '';
          });
      } catch (error) {
        console.error('Error submitting post:', error);
      }
    },
    openFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      this.selectedImage = event.target.files[0];
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    selectCategory(category) {
      this.selectedCategory = category;
      this.toggleDropdown();
    },
    async fetchCategories() {
      try {
        const response = await axiosClient.get('/categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async createCategory() {
      await axiosClient
        .post('/categories', { name: this.category })
        .then(() => {
          this.categories.push(this.category);
          this.category = '';
        });
    },
  },
  created() {
    this.fetchCategories(); // Fetch categories when the component is created
  },
};
</script>

<style scoped>
@import './editor.style.css';

.dropdown {
  position: relative;
  display: inline-block;
}
.add-box {
  display: flex;
}
.icon {
  cursor: pointer;
}
.dropdown-button {
  display: flex;
  justify-content: center;
  min-width: 160px;
  width: fit-content;
  padding: 10px 8px;
  background-color: #007bff;
  font-size: 16px;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 8px;
}

.dropdown-menu ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.dropdown-menu li {
  cursor: pointer;
  padding: 4px 8px;
}

.dropdown-menu li:hover {
  background-color: #f0f0f0;
}
.post-button {
  width: 10em;
}
</style>
