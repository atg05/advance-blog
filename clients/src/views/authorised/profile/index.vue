<template>
  <div class="profile-container">
    <div class="about">
      <img :src="userInfo.avatar" alt="User Profile" class="profile-pic" />
      <div class="info">
        <h1 class="username">
          {{ userInfo.firstName + ' ' + userInfo.lastName }}
        </h1>
        <div class="card">
          <div class="card-item">
            <span class="title">Posts</span>
            <span>{{ userInfo.posts }}</span>
          </div>
          <div class="card-item">
            <span class="title">Followers</span>
            <span>{{ userInfo.followers?.length }}</span>
          </div>
          <div class="card-item">
            <span class="title">Following</span>
            <span>{{ userInfo.following?.length }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="posts-container">
      <Post v-for="post in userPosts" :key="post.id" :post="post" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Post from '../../../components/post/index.vue';
import axiosClient from '../../../utils/axiosClient';

export default {
  name: 'Profile',
  components: { Post },
  data() {
    return {
      userInfo: null,
      userPosts: [],
    };
  },
  computed: {
    ...mapState(['user', 'posts']),
    ...mapGetters(['getAllPosts']), // Import the user state from Vuex
  },
  created() {
    this.fetchUserInfo();
    this.fetchUserPosts();
  },
  methods: {
    async fetchUserInfo() {
      console.log(this.user);
      try {
        const response = this.$route.params.id
          ? await axiosClient.get(`/user/${this.$route.params.id}`)
          : await axiosClient.get(`/user/${this.user.id}`);
        console.log(response.data);
        this.userInfo = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async fetchUserPosts() {
      try {
        const response = await axiosClient.get(`/post/?userId=${this.user.id}`);
        this.userPosts = response.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
@import './profile.style.css';
</style>
