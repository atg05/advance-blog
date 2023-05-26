<template>
  <div class="comment-list-container">
    <div class="author-container">
      <img
        :src="comment.commenter.avatar"
        class="comment-author-pic"
        alt="Profile-pic"
      />
      <div class="comment-header-title">
        <p>{{ comment.commenter.name }}</p>
        <p class="comment-date">
          {{
            comment.creationDate === 0
              ? 'Today'
              : `${comment.creationDate}  days ago`
          }}
        </p>
      </div>
    </div>
    <div class="comment-content">
      {{ comment.body }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentList',
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style scoped>
.comment-list-container {
  padding: 0.5em 1em;
  border-radius: 5px;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
}
.comment-list-container:hover {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em,
    rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em,
    rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
}
.author-container {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 3px;
  font-size: 12px;
}
.comment-header-title {
  display: flex;
  flex-direction: column;
}
.comment-date {
  font-size: 10px;
  font-weight: 200;
  color: gray;
}
.comment-author-pic {
  height: 40px;
  width: 40px;
  border-radius: 100%;
  object-fit: cover;
}
.comment-content {
  margin-left: 40px;
  font-size: 14px;
}
</style>
