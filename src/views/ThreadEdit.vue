<script>
import { findById } from '@/helpers';
import { mapActions } from 'vuex';
import asyncDataStatus from '@/mixins/asyncDataStatus';

export default {
  mixins: [asyncDataStatus],
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    thread() {
      return findById(this.$store.state.threads.items, this.id);
    },
    text() {
      const post = findById(
        this.$store.state.posts.items,
        this.thread.posts[0]
      );
      return post ? post.text : '';
    },
  },
  async created() {
    const thread = await this.fetchThread({
      id: this.id,
    });

    await this.fetchPost({
      id: thread.posts[0],
    });
    this.asyncDataStatus_fetched();
  },

  methods: {
    ...mapActions('threads', ['updateThread', 'fetchThread']),
    ...mapActions('posts', ['fetchPost']),
    // dispatch vue action
    async save({ title, text }) {
      const thread = await this.updateThread({
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
  <div v-if="asyncDataStatus_fetched" class="col-full push-top">
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
