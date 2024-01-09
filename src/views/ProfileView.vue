<script>
import { mapGetters } from 'vuex';
import store from '@/store';

export default {
  name: 'ProfileView',

  beforeRouteEnter() {
    if (!store.state.authId) return { name: 'home' };
  },
  beforeRouteUpdate() {},
  beforeRouteLeave() {},

  props: {
    edit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['ready'],
  computed: {
    ...mapGetters({ user: 'authUser' }),
  },

  created() {
    this.$emit('ready');
  },
};
</script>


<template>
  <div class="container">
    <h1>My Profile</h1>
    <!-- <div class="flex-grid">
      <div class="col-3 push-top">
        <UserProfileCard v-if="!edit" :user="user" />
        <UserProfileCardEditor v-else :user="user" />

        <p class="text-xsmall text-faded text-center">
          Member since june 2003, last visited 4 hours ago
        </p>
      </div>
      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead"> {{ user.username }}'s recent activity </span>
          <a href="#">See only started threads?</a>
        </div>

        <hr />

        <PostList :posts="user.posts" />
      </div>
    </div> -->
  </div>
</template>
