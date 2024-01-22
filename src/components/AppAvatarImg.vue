<template>
  <img :src="src || '/user-placeholder.png'" alt="avatar image" />
</template>

<script>
export default {
  props: {
    src: { type: String },
  },
};
</script>
