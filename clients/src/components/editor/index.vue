<template>
  <form @submit.prevent="submitPost" enctype="multipart/form-data">
    <textarea
      class="editor"
      placeholder="Write your thoughts here!"
      name="blog_post"
      v-model="blog_post"
    />

    <div class="action-buttons-container">
      <div class="image-upload-container">
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
      <Button type="submit">Post</Button>
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
  },
};
</script>

<style scoped>
@import './editor.style.css';
</style>
