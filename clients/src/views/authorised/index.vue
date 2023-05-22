<template>
  <div class="layout">
    <Header />
    <Sidebar />
    <div class="body-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from "../../components/sidebar/index.vue";
import Header from "../../components/header/index.vue";

export default {
  name: "PrimaryLayout",
  components: {
    Header,
    Sidebar,
  },
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 300px auto;
}
.body-container {
  height: 91vh;
  margin: 1em 0 0 1em;
  padding-bottom: 20px;
  height: 93vh;
  overflow: hidden;
}
</style>
