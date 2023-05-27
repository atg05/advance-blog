<template>
  <div class="list-container">
    <div v-for="post in favPosts" :key="post._id" class="post-card">
      <div class="post-card">
        <div class="post-card__header">
          <div class="post-card__image">
            <img
              class="post-card__image"
              v-if="post.featuredImage"
              :src="post.featuredImage"
              alt="Featured Image"
            />
          </div>

          <div class="post-card__header__title">
            <p>{{ post?.author?.name }}</p>
            <p>
              {{
                post?.postedDaysAgo == 0
                  ? `${post?.postedDaysAgo} days ago`
                  : 'Today'
              }}
            </p>
          </div>
        </div>
        <p class="post-card__content">{{ post.content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import PostCard from '../../../components/postCard/index.vue';
import store from '../../../store';
import axiosClient from '../../../utils/axiosClient';

export default {
  name: 'Favourite',
  components: { PostCard },
  data() {
    return {
      favPosts: [],
    };
  },
  computed: {
    ...mapState(['user']),
  },
  async created() {
    const response = await axiosClient.get(`/post/liked-post/${this.user.id}`);
    this.favPosts = response.data;
  },
};
</script>

<style scoped>
.list-container {
  padding: 2em 0px;
  display: flex;
  flex-direction: column;
  height: 45em;
  width: 60%;
  padding-bottom: 100px;
  gap: 3.5em;
  overflow-y: scroll;
}

.post-card {
  display: flex;
  flex-direction: column;
  padding: 0 1em 1em 1em;
  width: 100%;
  height: auto;
  position: relative;
  transition: transform 0.3s ease;
}
.post-card:hover {
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
    rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
}
.post-card__content {
  margin-top: 4em;
  text-align: justify;
  width: 100%;
  box-shadow: none;
}
.post-card__header {
  height: 5em;
  width: auto;
  margin-top: -2em;
  position: absolute;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 0.5em;
}
.post-card__image {
  height: 100%;
  width: 5em;
  border-radius: 100%;
}
.post-card__header__title {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5em;
  color: #4fa193;
}
</style>
