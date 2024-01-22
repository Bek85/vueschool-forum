<script>
import { mapActions, mapGetters } from 'vuex';
import difference from 'lodash/difference';
import asyncDataStatus from '@/mixins/asyncDataStatus';
import useNotifications from '@/composables/useNotifications';

export default {
  name: 'ThreadView',
  mixins: [asyncDataStatus],
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { addNotification } = useNotifications();
    return { addNotification };
  },

  computed: {
    ...mapGetters('auth', ['authUser']),
    threads() {
      return this.$store.state.threads.items;
    },
    posts() {
      return this.$store.state.posts.items;
    },
    thread() {
      return this.$store.getters['threads/thread'](this.id);
    },
    threadPosts() {
      return this.posts.filter((post) => post.threadId === this.id);
    },
  },
  async created() {
    // fetch the thread
    const thread = await this.fetchThread({
      id: this.id,
      onSnapshot: ({ isLocal, item, previousItem }) => {
        if (!this.asyncDataStatus_ready || isLocal) return;
        const newPostIds = difference(item.posts, previousItem.posts);

        const hasNewPosts = newPostIds.length > 0;
        if (hasNewPosts) {
          this.fetchPostsWithUsers(newPostIds);
        } else {
          this.addNotification({ message: 'Thread recently updated' });
        }
      },
    });

    this.fetchPostsWithUsers(thread.posts);

    this.asyncDataStatus_fetched();
  },
  methods: {
    ...mapActions('threads', ['fetchThread']),
    ...mapActions('posts', ['fetchPosts', 'createPost']),
    ...mapActions('users', ['fetchUser', 'fetchUsers']),

    addNewPost(eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id,
      };
      this.createPost(post);
    },
    async fetchPostsWithUsers(ids) {
      // fetch the posts
      const posts = await this.fetchPosts({
        ids,
        onSnapshot: ({ isLocal, previousItem }) => {
          console.log(isLocal);
          if (
            !this.asyncDataStatus_ready ||
            isLocal ||
            (previousItem?.edited && !previousItem?.edited?.at)
          )
            return;
          this.addNotification({ message: 'Thread recently updated' });
        },
      });

      // fetch the users associated with posts
      const users = posts.map((post) => post.userId).concat(this.thread.userId);
      await this.fetchUsers({ ids: users });
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
