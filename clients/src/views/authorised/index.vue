<template>
  <div class="layout">
    <Header />
    <Sidebar />
    <div class="floating-icon">
      <router-link to="/editor">
        <span class="material-symbols-outlined icon"> stylus_note </span>
      </router-link>
    </div>
    <div class="body-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from '../../components/sidebar/index.vue';
import Header from '../../components/header/index.vue';

export default {
  name: 'PrimaryLayout',
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
.floating-icon {
  position: absolute;
  bottom: 5em;
  right: 15em;
  background-color: var(--primary-color);
  padding: 1.5em;
  border-radius: 100%;
  animation: bounce 1s infinite alternate;
  transition: background-color 0.3s;
}

.icon {
  color: antiquewhite;
}

.floating-icon:hover {
  background-color: #002e3f;
  border-left: 15px solid white;
  border-bottom: 15px solid white;
  cursor: pointer;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
