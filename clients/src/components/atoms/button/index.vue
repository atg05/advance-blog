<template>
  <button :class="classes" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "Button",
  props: {
    variant: {
      type: String,
      default: "primary",
    },
    size: {
      type: String,
      default: "medium",
    },
  },
  computed: {
    classes() {
      return ["btn", `btn-${this.variant}`, `btn-${this.size}`];
    },
  },
};
</script>

<style scoped>
@import "./button.style.css";
</style>
