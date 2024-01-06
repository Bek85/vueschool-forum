<script>
import { mapActions } from 'vuex';
import NProgress from 'nprogress';

export default {
  name: 'App',
  data() {
    return {
      showPage: false,
    };
  },

  created() {
    this.fetchAuthUser();

    NProgress.configure({
      speed: 200,
      showSpinner: false,
    });

    this.$router.beforeEach(() => {
      this.showPage = false;
      NProgress.start();
    });
  },
  methods: {
    ...mapActions(['fetchAuthUser']),
    onPageReady() {
      this.showPage = true;
      NProgress.done();
    },
  },
};
</script>

<template>
  <TheNavbar />
  <div class="container">
    <RouterView v-show="showPage" @ready="onPageReady" />
    <AppSpinner v-show="!showPage" class="push-top" />
  </div>
</template>

<style>
@import '@/assets/styles.css';
@import '/node_modules/nprogress/nprogress.css';

#nprogress .bar {
  background: #57ad8d !important;
}
</style>
