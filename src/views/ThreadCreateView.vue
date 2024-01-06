<script>
import { findById } from '@/helpers';
import { mapActions } from 'vuex';
import asyncDataStatus from '@/mixins/asyncDataStatus';

export default {
  mixins: [asyncDataStatus],
  props: {
    forumId: {
      type: String,
      required: true,
    },
  },
  computed: {
    forum() {
      return findById(this.$store.state.forums, this.forumId);
      // return this.$store.state.forums.find(
      //   (forum) => forum.id === this.forumId
      // );
    },
  },

  async created() {
    await this.fetchForum({
      id: this.forumId,
    });
    this.asyncDataStatus_fetched();
  },

  methods: {
    ...mapActions(['createThread', 'fetchForum']),
    // dispatch vue action
    async save({ title, text }) {
      const thread = await this.createThread({
        title,
        text,
        forumId: this.forum.id,
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
        name: 'forum',
        params: {
          id: this.forum.id,
        },
      });
    },
  },
};
</script>


<template>
  <div v-if="asyncDataStatus_fetched" class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <ThreadEditor :forum-id="forum.id" @save="save" @cancel="cancel" />
  </div>
</template>
