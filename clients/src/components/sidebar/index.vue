<template>
  <aside class="side-bar">
    <router-link to="/" class="icon-link">
      <span class="material-symbols-outlined"> feed </span>
      <span>Home</span>
    </router-link>

    <router-link to="/editor" class="icon-link">
      <span class="material-symbols-outlined"> stylus_note </span>
      <span>Write</span>
    </router-link>
    <router-link to="/fav/post" class="icon-link">
      <span class="material-symbols-outlined"> favorite </span>
      <span>Posts</span>
    </router-link>
    <router-link to="/fav/author" class="icon-link">
      <span class="material-symbols-outlined"> favorite </span>
      <span>Authors</span>
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
import store from '../../store';
export default {
  name: 'Sidebar',
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
