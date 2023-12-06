<template>
  <div class="not-found">
    <h1>404 Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <router-link to="/">Go back to home page</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView',
};
</script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 50px;
}
</style>
