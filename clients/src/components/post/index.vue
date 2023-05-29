<template>
  <div class="post-item">
    <div class="author">
      <router-link
        :to="{ name: 'authorProfile', params: { id: data.author?.id } }"
        class="author_name"
      >
        <img :src="data.author.avatar" alt="Author Avatar" class="avtar" />
        <span>{{ data.author.name }}</span>
      </router-link>
      <div v-if="data.author?.id !== user.id">
        <span
          class="follow-action"
          :class="{
            'follow-icon': !data.following,
            'unfollow-icon': data.following,
          }"
          @click="data.following ? unfollowUser() : followUser()"
        >
          {{ data.following ? 'Unfollow' : 'Follow' }}
        </span>
      </div>
      <div v-if="data.author?.id === user.id" class="author-actions">
        <span class="material-symbols-outlined author-icon"> edit </span>
        <span class="material-symbols-outlined author-icon" @click="deletePost">
          delete
        </span>
      </div>
    </div>
    <div class="post-body">
      <div class="title" v-if="data.title">{{ data.title }}</div>

      <img
        v-if="data.featuredImage"
        :src="data.featuredImage"
        alt="Featured Image"
        class="featured-image"
      />
      <div class="content">
        {{
          data.content.split(' ').length > 150
            ? data.content.split(' ').slice(0, 100).join(' ') + '...'
            : data.content
        }}
      </div>
    </div>
    <span
      v-if="!isOfflineRoute"
      class="material-symbols-outlined download-icon"
      @click="savePostToLocalStorage"
    >
      download
    </span>
    <span
      v-if="!isReadingSession"
      class="material-symbols-outlined download-icon reading-icon"
      @click="savePostToSession"
    >
      local_library
    </span>
    <div class="action" v-if="!isReadingSession && !isOfflineRoute">
      <div
        class="icon-container"
        :class="{ 'liked-post': data.liked }"
        @click="likePost"
      >
        <span class="material-symbols-outlined"> thumb_up </span>
        <span>Like</span>
      </div>
      <div class="icon-container" @click="toggleComment">
        <span class="material-symbols-outlined"> comment </span>
        <span>Comment</span>
      </div>
      <div class="icon-container share-button" @click="sharePost">
        <span class="material-symbols-outlined"> share </span>
        <span>Share</span>
      </div>
    </div>
    <div
      class="comment-box"
      v-if="
        (this.isCommentActive && !isReadingSession) ||
        (this.isCommentActive && !isOfflineRoute)
      "
    >
      <Comment :post="post" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import store from '../../store';
import axiosClient from '../../utils/axiosClient';
import Comment from '../comment/index.vue';

export default {
  name: 'Post',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  components: {
    Comment,
  },

  data() {
    return {
      data: {},
      isFollowing: false,
      isCommentActive: false,
    };
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['getAllPosts']),
    isReadingSession() {
      return this.$route.path?.includes('reading-session');
    },
    isOfflineRoute() {
      return this.$route.path?.includes('offlined');
    },
  },
  methods: {
    async followUser() {
      try {
        await axiosClient
          .post(`/user/${this.data.author.id}/follow`, {
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
          .post(`/user/${this.data.author.id}/unfollow`, {
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
      if (this.data.liked) {
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
    toggleComment() {
      this.isCommentActive = !this.isCommentActive;
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
    async deletePost() {
      await axiosClient
        .delete(`post/${this.post?.id}`, {
          userId: this.user.id,
        })
        .then(() => {
          store.dispatch('setPosts', this.user.id);
        });
    },

    sharePost() {
      if (navigator.share) {
        navigator
          .share({
            title: this.data.title,
            text: this.data.content,
            url: window.location.href,
          })
          .then(() => console.log('Shared successfully.'))
          .catch((error) => console.error('Error sharing:', error));
      } else {
        console.log('Web Share API not supported.');
      }
    },
    savePostToSession() {
      this.$store.dispatch('saveToSession', { post: this.post });
    },
    savePostToLocalStorage() {
      const currentUserId = this.user.id;
      let storedPosts = JSON.parse(localStorage.getItem(currentUserId)) || [];
      const postExists = storedPosts.some(
        (storedPost) => storedPost.id === this.data.id,
      );

      if (!postExists) {
        storedPosts.push(this.post);
        localStorage.setItem(currentUserId, JSON.stringify(storedPosts));
        alert('Post downloaded');
      } else {
        alert('Post already downloaded!');
      }
    },
  },
  async created() {
    // Check if the current user is already following the author
    if (this.post?.author?.followers?.includes(this.user.id)) {
      this.isFollowing = true;
    }
    if (this.$route.path?.includes('post')) {
      const response = await axiosClient.get(`/post/${this.$route.params.id}`);
      this.data = response.data;
    } else {
      this.data = this.post;
    }
  },
};
</script>

<style>
@import './post.style.css';
</style>
