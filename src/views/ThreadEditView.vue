<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    thread() {
      return this.$store.state.threads.find((thread) => thread.id === this.id);
    },
    text() {
      const threadText = this.$store.state.posts.find((post) => {
        return post.id === this.thread.posts[0];
      }).text;

      return threadText;
    },
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
  <div class="col-full push-top">
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
