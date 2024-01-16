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
    lastPostFetched() {
      if (this.user.posts.length === 0) return null;
      return this.user.posts[this.user.posts.length - 1];
    },
  },

  async created() {
    await this.fetchUserPosts();

    // setTimeout(() => {
    //   this.$store.dispatch('auth/fetchAuthUsersPosts', {
    //     startAfter: this.lastPostFetched,
    //   });
    // }, 2000);
    this.asyncDataStatus_fetched();
  },

  methods: {
    fetchUserPosts() {
      return this.$store.dispatch('auth/fetchAuthUsersPosts', {
        startAfter: this.lastPostFetched,
      });
    },
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
          Member since December 2023, last visited 1 hour ago
        </p>
      </div>
      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead"> {{ user.username }}'s recent activity </span>
          <a href="#">See only started threads?</a>
        </div>

        <hr />

        <PostList :posts="user.posts" />
        <AppInfiniteScroll
          :done="user.posts.length === user.postsCount"
          @load="fetchUserPosts"
        />
      </div>
    </div>
  </div>
</template>
