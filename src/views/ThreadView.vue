<script>
export default {
  name: 'ThreadView',
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  computed: {
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
    const thread = await this.$store.dispatch('fetchThread', { id: this.id });

    // fetch the user
    this.$store.dispatch('fetchUser', { id: thread.userId });

    // fetch the posts
    thread.posts.forEach(async (postId) => {
      const post = await this.$store.dispatch('fetchPost', { id: postId });

      // fetch the user for each posts
      this.$store.dispatch('fetchUser', { id: post.userId });
    });
  },
  methods: {
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
  <div class="col-large push-top">
    <h1>
      {{ thread.title }}

      <RouterLink
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
    <PostEditor @save="addNewPost" />
  </div>
</template>

<style scoped>
.heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
