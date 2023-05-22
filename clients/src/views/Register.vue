<!-- Register.vue -->

<template>
  <div class="container">
    <span class="material-symbols-outlined user_account"> account_circle </span>
    <Heading :level="1"> Register Yourself Today</Heading>
    <form @submit.prevent="registerUser">
      <InputField
        label="First Name"
        type="text"
        id="firstName"
        name="firstName"
        :value="firstName"
        @update:value="(newValue) => (firstName = newValue)"
        required
      />
      <InputField
        label="Last Name"
        type="text"
        id="lastName"
        name="lastName"
        :value="lastName"
        @update:value="(newValue) => (lastName = newValue)"
        required
      />
      <InputField
        label="Email"
        type="email"
        id="email"
        name="email"
        v-model="email"
        :value="email"
        @update:value="(newValue) => (email = newValue)"
        required
      />
      <InputField
        label="Password"
        type="password"
        id="password"
        name="password"
        v-model="password"
        :value="password"
        @update:value="(newValue) => (password = newValue)"
        required
      />

      <Button type="submit">Register</Button>
    </form>
    <router-link to="/login">Already have an account?</router-link>
  </div>
</template>

<script>
import InputField from '../components/atoms/input/index.vue';
import Button from '../components/atoms/button/index.vue';
import Heading from '../components/atoms/headings/index.vue';
import axiosClient from '../utils/axiosClient';

export default {
  name: 'Register',
  components: {
    InputField,
    Button,
    Heading,
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };
  },
  methods: {
    async registerUser() {
      await axiosClient
        .post('/auth/register', {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
        })
        .then(() => {
          this.$router.push('/login');
        })
        .catch((err) => {
          console.log(err);
        });

      // Perform user registration logic here
    },
  },
};
</script>

<style scoped>
.container {
  min-width: 300px;
  margin: 10em auto;
  max-width: 30vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5em;
  padding: 2%;
  border-radius: 5px;
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
input {
  width: 100%;
  height: 2em;
}

button {
  width: 100%;
  background-color: var(--primary-color);
}
</style>
