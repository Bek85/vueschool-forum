<template>
  <div class="form-group">
    <label :for="name">{{ label }}</label>
    <VeeField
      :id="name"
      :model-value="modelValue"
      :name="name"
      :label="label"
      class="form-input"
      v-bind="$attrs"
      @input="$emit('modelUpdate', $event)"
    />
    <VeeErrorMessage :name="name" class="form-error" />
  </div>
</template>

<script>
export default {
  props: {
    name: { type: String, required: true },
    label: { type: String, required: true },
    modelValue: { type: String, required: true },
  },
  emits: ['modelUpdate'],
};
</script>
