<template>
  <header class="header">
    <div class="logo-title">
      <span class="material-symbols-outlined"> rebase_edit </span>

      <span>Write-Pad</span>
    </div>
    <div class="search-bar">
      <input type="text" placeholder="Search..." class="search-box" />
      <span class="material-symbols-outlined search-icon">search</span>
    </div>

    <!-- <div class="menu">
      <span class="material-symbols-outlined"> menu </span>
    </div> -->
  </header>
</template>

<script>
export default {
  name: 'Header',
};
</script>

<style scoped>
@import './header.style.css';
</style>
