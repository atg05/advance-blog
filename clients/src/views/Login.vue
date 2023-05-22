<template>
  <div class="container">
    <span class="material-symbols-outlined user_account"> account_circle </span>
    <h1>Login</h1>
    <form @submit.prevent="loginUser" class="form-container">
      <InputField
        label="Email"
        type="email"
        id="email"
        name="email"
        :value="email"
        @update:value="(newValue) => (email = newValue)"
        required
      />
      <InputField
        label="Password"
        type="password"
        id="password"
        name="password"
        :value="password"
        @update:value="(newValue) => (password = newValue)"
        required
      />
      <Button type="submit">Login</Button>
    </form>
    <router-link to="/register">Don't have an account?</router-link>
  </div>
</template>

<script>
import InputField from '../components/atoms/input/index.vue';
import Button from '../components/atoms/button/index.vue';
import store from '../store';
import { mapGetters } from 'vuex';
import axiosClient from '../utils/axiosClient';

export default {
  name: 'Login',
  components: {
    InputField,
    Button,
  },
  computed: {
    ...mapGetters(['getUserInfo']),
  },

  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async loginUser() {
      await axiosClient
        .post('/auth/login', { email: this.email, password: this.password })
        .then((res) => {
          console.log(res);
          store.dispatch('login', res.data?.data);
          this.$router.push('/');
        });
      // Send login request to server
    },
  },
};
</script>

<style scoped>
.container,
.form-container {
  min-width: 300px;
  margin: 10em auto;
  max-width: 30vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5em;
  padding: 2%;
  border-radius: 5px;
}
.container {
  padding-bottom: 60px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px,
    rgba(0, 0, 0, 0.22) 0px 10px 10px;
}

.user_account {
  display: block;
  border-radius: 100%;
  font-size: 4rem;
  margin-top: -60px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px,
    rgba(0, 0, 0, 0.05) 0px 5px 10px;
}
.form-container {
  margin: 0;
  border: none;
}

input {
  width: 100%;
  height: 2em;
}

button {
  width: 100%;
  background-color: var(--primary-color);
}
</style>
