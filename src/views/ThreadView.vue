<script>
import firebase from 'firebase';

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
      // return findById(this.threads, this.id);
      // return this.threads.find((t) => t.id === this.id);
      return this.$store.getters.thread(this.id);
    },
    threadPosts() {
      return this.posts.filter((post) => post.threadId === this.id);
    },
  },
  created() {
    // fetch the thread
    firebase
      .firestore()
      .collection('threads')
      .doc(this.id)
      .onSnapshot((doc) => {
        const thread = { ...doc.data(), id: doc.id };
        this.$store.commit('setThread', { thread });

        // fetch the user
        firebase
          .firestore()
          .collection('users')
          .doc(thread.userId)
          .onSnapshot((doc) => {
            const user = { ...doc.data(), id: doc.id };
            this.$store.commit('setUser', { user });
          });

        // fetch the posts
        thread.posts.forEach((postId) => {
          firebase
            .firestore()
            .collection('posts')
            .doc(postId)
            .onSnapshot((doc) => {
              const post = { ...doc.data(), id: doc.id };
              this.$store.commit('setPost', { post });

              // fetch the user for each posts
              firebase
                .firestore()
                .collection('users')
                .doc(post.userId)
                .onSnapshot((doc) => {
                  const user = { ...doc.data(), id: doc.id };
                  this.$store.commit('setUser', { user });
                });
            });
        });
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
