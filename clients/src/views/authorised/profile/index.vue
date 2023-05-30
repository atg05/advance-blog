<template>
  <div :class="['profile-container']">
    <div v-if="this.user?.role === 'admin'">
      <span
        v-if="!this.userInfo?.isBanned"
        class="material-symbols-outlined ban-user"
        @click="banUser"
      >
        person_off
      </span>
      <span
        v-if="this.userInfo?.isBanned"
        class="material-symbols-outlined ban-user unban"
        @click="unBanUser"
      >
        verified_user
      </span>
    </div>

    <div :class="['about', { banned_profile: this.userInfo?.isBanned }]">
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
import { mapState } from 'vuex';
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
    ...mapState(['user']),
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
        console.error('Error fetching user info:', error);
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
        console.error('Error fetching user posts:', error);
      }
    },
    async banUser() {
      try {
        const userId = this.$route.params?.id || this.user.id;

        await axiosClient.put(`/user/${userId}/ban`).then(async () => {
          await this.fetchUserInfo();
        });

        console.log('User banned successfully');
        // Show a success message or perform any necessary actions after banning the user
      } catch (error) {
        console.error('Failed to ban user:', error);
        // Handle the error case, show an error message, etc.
      }
    },
    async unBanUser() {
      try {
        const userId = this.$route.params?.id || this.user.id;

        await axiosClient.put(`/user/${userId}/unban`).then(async () => {
          await this.fetchUserInfo();
        });

        console.log('User unbanned successfully');
        // Show a success message or perform any necessary actions after unbanning the user
      } catch (error) {
        console.error('Failed to unban user:', error);
        // Handle the error case, show an error message, etc.
      }
    },
  },
};
</script>

<style>
@import './profile.style.css';
</style>
