<script>
import { mapGetters } from 'vuex';
import asyncDataStatus from '@/mixins/asyncDataStatus';

export default {
  name: 'ProfileView',
  mixins: [asyncDataStatus],

  props: {
    edit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['ready'],
  computed: {
    ...mapGetters('auth', { user: 'authUser' }),
  },

  async created() {
    await this.$store.dispatch('auth/fetchAuthUsersPosts');
    this.asyncDataStatus_fetched();
  },
};
</script>


<template>
  <div class="container" style="width: 100%">
    <div class="flex-grid">
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
    </div>
  </div>
</template>
