<template>
  <div class="comment-container">
    <div class="comment-editor-container">
      <textarea placeholder="Write a comment..." class="comment-editor" />
      <button class="comment-button">Comment</button>
    </div>
    <div class="comment-lists">
      <CommentList /><CommentList /><CommentList /><CommentList />
    </div>
  </div>
</template>

<script>
import CommentList from './CommentList.vue';

export default {
  name: 'Comment',
  components: {
    CommentList,
  },
  data() {
    return {};
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
