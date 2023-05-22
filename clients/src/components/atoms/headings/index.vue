<template>
  <component :is="`h${level}`" class="heading"><slot /></component>
</template>

<script>
export default {
  name: "Heading",
  props: {
    level: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style>
.heading {
  font-weight: bold;
  margin-bottom: 1rem;
}
</style>
