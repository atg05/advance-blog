<template>
  <div class="input-container">
    <label v-if="label" :for="id" class="label">{{ label }}</label>
    <!-- why emit -->
    <!-- v-bind -->

    <input
      :type="type"
      :id="id"
      :name="name"
      :value="value"
      :placeholder="placeholder"
      @input="$emit('update:value', $event.target.value)"
      v-bind="$attrs"
      :required="required"
      class="input-field"
    />
  </div>
</template>

<script>
export default {
  name: "InputField",
  props: {
    label: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
    },
  },
};
</script>

<style scoped>
@import "./input.style.css";
</style>
