<template>
  <div class="comment-container">
    <div class="comment-editor-container">
      <textarea
        placeholder="Write a comment..."
        v-model="commentText"
        class="comment-editor"
      />
      <button class="comment-button" @click="postComment">Comment</button>
    </div>
    <div class="comment-lists">
      <CommentList
        v-for="comment in comments"
        :key="comment._id"
        :comment="comment"
      />
    </div>
  </div>
</template>

<script>
import CommentList from './CommentList.vue';
import axiosClient from '../../utils/axiosClient';
import { mapState } from 'vuex';

export default {
  name: 'Comment',
  components: {
    CommentList,
  },
  computed: {
    ...mapState(['user']),
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      commentText: '',
      comments: [],
    };
  },
  created() {
    this.fetchComments();
  },
  methods: {
    async fetchComments() {
      try {
        const response = await axiosClient.get(
          `post/${this.post?.id}/comments`,
        );
        this.comments = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async postComment() {
      try {
        const response = await axiosClient.post(
          `post/${this.post?.id}/comments`,
          {
            commenterId: this.user?.id,
            body: this.commentText,
          },
        );
        const savedComment = response.data;
        this.comments.push(savedComment);
        this.commentText = ''; // Clear the comment input field
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style>
.comment-container {
  border-top: 1px solid gray;
  padding: 0.5em 1em;
}

.comment-editor-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5em;
}
.comment-editor {
  width: 100%;
  padding: 5px;
  resize: none;
  height: 5em;
  border-radius: 5px;
}
.comment-button {
  background-color: var(--primary-color);
  color: whitesmoke;
  border-radius: 10px;
  padding: 0.3em 0.4em;
  margin-bottom: 20px;
}
.comment-lists {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 15em;
  overflow-y: scroll;
}
</style>
