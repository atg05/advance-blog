<template>
  <aside class="side-bar">
    <router-link to="/" class="icon-link">
      <span class="material-symbols-outlined"> feed </span>
      <span v-if="this.user.role != 'admin'">Home</span>
      <span v-else-if="this.user.role === 'admin'">Post Report</span>
    </router-link>

    <router-link to="/editor" class="icon-link">
      <span class="material-symbols-outlined"> stylus_note </span>
      <span>Write</span>
    </router-link>
    <router-link to="/fav/post" class="icon-link">
      <span class="material-symbols-outlined"> favorite </span>
      <span>Posts</span>
    </router-link>
    <router-link to="/reading-session" class="icon-link">
      <span class="material-symbols-outlined"> local_library </span>
      <span>Reading Session</span>
    </router-link>
    <router-link to="/offlined" class="icon-link">
      <span class="material-symbols-outlined"> download </span>
      <span>Downloads</span>
    </router-link>

    <router-link to="/profile" class="icon-link">
      <span class="material-symbols-outlined"> account_circle </span>
      <span>Profile</span>
    </router-link>

    <!-- <router-link to="/settings" class="icon-link">
      <span class="material-symbols-outlined"> settings </span>
      <span>Settings</span>
    </router-link> -->
    <div class="icon-link" @click="logout">
      <span class="material-symbols-outlined"> logout </span>
      <span>Logout</span>
    </div>
  </aside>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import store from '../../store';
export default {
  name: 'Sidebar',
  computed: {
    ...mapState(['user']),
  },
  methods: {
    logout() {
      store.dispatch('logout');
      this.$router.push('/login');
      // Send login request to server
    },
  },
};
</script>

<style>
@import './sidebar.style.css';
</style>
