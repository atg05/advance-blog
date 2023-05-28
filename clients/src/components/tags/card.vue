<template>
  <div class="tag-card-container"><slot /></div>
</template>

<script>
export default {
  name: 'TagCard',
};
</script>

<style scoped>
.tag-card-container {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  background-color: var(--primary-color);
  color: #fff;
  width: fit-content;
  margin-bottom: 1em;
  border-radius: 10px;
}

.tag-card-container:hover {
  color: #867ad1;
  background-color: antiquewhite;
}
</style>
