<template>
  <div class="main-container">
    <!-- Will Decide which component will be render on any specific route -->
    <router-view />
  </div>
</template>

<script>
import PrimaryLayout from './views/authorised/index.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';

export default {
  name: 'App',
  components: {
    PrimaryLayout,
    Register,
    Login,
  },
};
</script>

<style scoped>
.main-contianer {
  min-height: 100vh;
  min-width: 100vw;
}
</style>
