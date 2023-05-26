<template>
  <div class="profile-container">
    <div class="about">
      <img :src="userInfo?.avatar" alt="User Profile" class="profile-pic" />
      <div class="info">
        <h1 class="username">
          {{ userInfo?.firstName + ' ' + userInfo?.lastName }}
        </h1>
        <div class="card">
          <div class="card-item">
            <span class="title">Followers</span>
            <span>{{ userInfo?.followers?.length }}</span>
          </div>
          <div class="card-item">
            <span class="title">Following</span>
            <span>{{ userInfo?.following?.length }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="posts-container">
      <!-- <Post v-for="post in userInfo?.userPosts" :key="post.id" :post="post" /> -->
      <template v-if="userPosts?.length > 0">
        <Post v-for="post in userPosts" :key="post.id" :post="post" />
      </template>
      <template v-else>
        <p>User has not created any post yet...</p>
      </template>
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
      try {
        const response = this.$route.params?.id
          ? await axiosClient.get(`/user/${this.$route.params.id}`)
          : await axiosClient.get(`/user/${this.user.id}`);

        this.userInfo = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async fetchUserPosts() {
      try {
        const response = this.$route.params.id
          ? await axiosClient.get(
              `/post/?onlyUserPost=true&userId=${this.$route.params.id}`,
            )
          : await axiosClient.get(
              `/post/?onlyUserPost=true&userId=${this.user.id}`,
            );
        this.userPosts = response.data?.filter((data) => {
          if (this.$route.params.id) {
            if (data.author.id === this.$route.params.id) {
              return data;
            }
          } else {
            if (data.author.id === this.user.id) {
              return data;
            }
          }
        });
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
