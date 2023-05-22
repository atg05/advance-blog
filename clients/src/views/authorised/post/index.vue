<template>
  <main>
    <Editor />
  </main>
</template>

<script>
import Editor from "../../../components/editor/index.vue";

export default {
  name: "Post",
  components: { Editor },
};
</script>

<style>
main {
  grid-area: "main";
}
</style>
