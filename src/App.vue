<script>
import { mapActions } from 'vuex';
export default {
  name: 'App',
  created() {
    this.fetchAuthUser();
  },
  methods: {
    ...mapActions(['fetchAuthUser']),
  },
};
</script>

<template>
  <TheNavbar />
  <div class="container">
    <RouterView />
  </div>
</template>

<style>
@import '@/assets/styles.css';
</style>
