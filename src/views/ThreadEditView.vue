<script>
import { findById } from '@/helpers';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    thread() {
      return findById(this.$store.state.threads, this.id);

      // return this.$store.state.threads.find((thread) => thread.id === this.id);
    },
    text() {
      const post = findById(this.$store.state.posts, this.thread.posts[0]);
      return post ? post.text : '';

      // const threadText = this.$store.state.posts.find((post) => {
      //   return post.id === this.thread.posts[0];
      // }).text;

      // return threadText;
    },
  },
  async created() {
    const thread = await this.$store.dispatch('fetchThread', {
      id: this.id,
    });
    this.$store.dispatch('fetchPost', {
      id: thread.posts[0],
    });
  },

  methods: {
    // dispatch vue action
    async save({ title, text }) {
      const thread = await this.$store.dispatch('updateThread', {
        title,
        text,
        id: this.id,
      });
      this.$router.push({
        name: 'thread',
        params: {
          id: thread.id,
        },
      });
    },
    cancel() {
      this.$router.push({
        name: 'thread',
        params: {
          id: this.id,
        },
      });
    },
  },
};
</script>


<template>
  <div v-if="thread && text" class="col-full push-top">
    <h1>
      Editing <i>{{ thread.title }}</i>
    </h1>

    <ThreadEditor
      :title="thread.title"
      :text="text"
      @save="save"
      @cancel="cancel"
    />
  </div>
</template>
