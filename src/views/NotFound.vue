<script>
export default {
  name: 'NotFoundView',
  emits: ['ready'],

  created() {
    this.$emit('ready');
  },
};
</script>


<template>
  <div class="not-found">
    <h1>404 Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <router-link to="{name: 'home'}">Read some cool threads</router-link>
  </div>
</template>


<style scoped>
.not-found {
  text-align: center;
  margin-top: 50px;
}
</style>
