<script>
import { mapActions } from 'vuex';
export default {
  name: 'App',
  data() {
    return {
      showPage: false,
    };
  },

  created() {
    this.fetchAuthUser();
    this.$router.beforeEach(() => {
      this.showPage = false;
    });
  },
  methods: {
    ...mapActions(['fetchAuthUser']),
  },
};
</script>

<template>
  <TheNavbar />
  <div class="container">
    <RouterView v-show="showPage" @ready="showPage = true" />
    <AppSpinner v-show="!showPage" class="push-top" />
  </div>
</template>

<style>
@import '@/assets/styles.css';
</style>
