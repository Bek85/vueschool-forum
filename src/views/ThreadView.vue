<script>
import { mapActions, mapGetters } from 'vuex';
import asyncDataStatus from '@/mixins/asyncDataStatus';

export default {
  name: 'ThreadView',
  mixins: [asyncDataStatus],
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapGetters(['authUser']),
    threads() {
      return this.$store.state.threads;
    },
    posts() {
      return this.$store.state.posts;
    },
    thread() {
      return this.$store.getters.thread(this.id);
    },
    threadPosts() {
      return this.posts.filter((post) => post.threadId === this.id);
    },
  },
  async created() {
    // fetch the thread
    const thread = await this.fetchThread({ id: this.id });

    // fetch the user
    // this.fetchUser({ id: thread.userId });

    // fetch the posts
    const posts = await this.fetchPosts({
      ids: thread.posts,
    });

    // fetch the users associated with posts
    const userIds = posts.map((post) => post.userId).concat(thread.userId);
    await this.fetchUsers({ ids: userIds });

    this.asyncDataStatus_fetched();
  },
  methods: {
    ...mapActions(['fetchThread', 'fetchPosts', 'fetchUser', 'fetchUsers']),
    addNewPost(eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id,
      };
      this.$store.dispatch('createPost', post);
    },
  },
};
</script>


<template>
  <div v-if="asyncDataStatus_ready" class="col-large push-top">
    <h1>
      {{ thread.title }}

      <RouterLink
        v-if="thread.userId === authUser?.id"
        :to="{ name: 'threadEdit', id: id }"
        class="btn-green btn-small"
        >Edit Thread</RouterLink
      >
    </h1>
    <p>
      By <a href="#" class="link-unstyled">{{ thread.author?.name }}</a
      >, <AppDate :timestamp="thread.publishedAt" />.
      <span
        style="float: right; margin-top: 2px"
        class="hide-mobile text-faded text-small"
        >{{ thread.repliesCount }} replies by
        {{ thread.contributorsCount }} contributors</span
      >
    </p>

    <PostList :posts="threadPosts" />
    <PostEditor v-if="authUser" @save="addNewPost" />
    <div v-else class="text-center" style="margin-bottom: 50px">
      <RouterLink :to="{ name: 'signIn', query: { redirectTo: $route.path } }"
        >Sign In</RouterLink
      >
      or
      <RouterLink :to="{ name: 'register', query: { redirectTo: $route.path } }"
        >Register</RouterLink
      >
    </div>
  </div>
</template>

<style scoped>
.heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
