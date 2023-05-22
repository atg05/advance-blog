<template>
  <div class="post-item">
    <div class="author">
      <router-link :to="'/profile/' + post.author.id" class="author_name">
        <img :src="post.author.avatar" alt="Author Avatar" class="avtar" />
        <span>{{ post.author.name }}</span>
      </router-link>
      <div v-if="post.author.id !== user.id">
        <span
          class="material-symbols-outlined"
          :class="{
            'follow-icon': !post.following,
            'unfollow-icon': post.following,
          }"
          @click="post.following ? unfollowUser() : followUser()"
        >
          {{ post.following ? 'person_remove' : 'person_add' }}
        </span>
      </div>
    </div>
    <div class="post-body">
      <div class="title" v-if="post.title">{{ post.title }}</div>

      <img
        v-if="post.featuredImage"
        :src="post.featuredImage"
        alt="Featured Image"
        class="featured-image"
      />
      <div class="content">
        {{
          post.content.split(' ').length > 150
            ? post.content.split(' ').slice(0, 100).join(' ') + '...'
            : post.content
        }}
      </div>
    </div>
    <div class="action">
      <div
        class="icon-container"
        :class="{ 'liked-post': post.liked }"
        @click="likePost"
      >
        <span class="material-symbols-outlined"> thumb_up </span>
        <span>Like</span>
      </div>
      <div class="icon-container">
        <span class="material-symbols-outlined"> comment </span>
        <span>Comment</span>
      </div>
      <div class="icon-container share-button" @click="sharePost">
        <span class="material-symbols-outlined"> share </span>
        <span>Share</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import store from '../../store';
import axiosClient from '../../utils/axiosClient';

export default {
  name: 'Post',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isFollowing: false,
    };
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['getAllPosts']),
  },
  methods: {
    async followUser() {
      try {
        await axiosClient
          .post(`/user/${this.post.author.id}/follow`, {
            followerId: this.user.id,
          })
          .then(() => {
            store.dispatch('setPosts', this.user.id);
          });
        this.isFollowing = true;
      } catch (error) {
        console.log(error);
      }
    },
    async unfollowUser() {
      try {
        await axiosClient
          .post(`/user/${this.post.author.id}/unfollow`, {
            followerId: this.user.id,
          })
          .then(() => {
            store.dispatch('setPosts', this.user.id);
          });
        this.isFollowing = false;
      } catch (error) {
        console.log(error);
      }
    },
    async likePost() {
      if (this.post.liked) {
        this.unlikePost();
      } else {
        try {
          await axiosClient
            .post(`post/${this.post?.id}/like`, {
              userId: this.user.id,
            })
            .then(() => {
              store.dispatch('setPosts', this.user.id);
            });
        } catch (error) {
          console.log(error);
        }
      }
    },
    async unlikePost() {
      try {
        await axiosClient
          .post(`post/${this.post?.id}/unlike`, {
            userId: this.user.id,
          })
          .then(() => {
            store.dispatch('setPosts', this.user.id);
          });
      } catch (error) {
        console.log(error);
      }
    },
    async addComment() {
      try {
        const response = await axiosClient.post(
          `post/${this.post?._id}/comments`,
          this.newComment,
        );
        this.comments.push(response.data);
        this.newComment.body = '';
      } catch (error) {
        console.log(error);
      }
    },
    sharePost() {
      if (navigator.share) {
        navigator
          .share({
            title: this.post.title,
            text: this.post.content,
            url: window.location.href,
          })
          .then(() => console.log('Shared successfully.'))
          .catch((error) => console.error('Error sharing:', error));
      } else {
        console.log('Web Share API not supported.');
      }
    },
  },
  created() {
    // Check if the current user is already following the author
    if (this.post.author.followers?.includes(this.user.id)) {
      this.isFollowing = true;
    }
  },
};
</script>

<style>
@import './post.style.css';
</style>
