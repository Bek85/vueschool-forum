<script>
import { findById } from '@/helpers';
import { mapActions } from 'vuex';
import asyncDataStatus from '@/mixins/asyncDataStatus';

export default {
  mixins: [asyncDataStatus],

  beforeRouteLeave() {
    if (this.formIsDirty) {
      const confirmed = window.confirm(
        'Are you sure you want to leave? Unsaved changes will be lost!'
      );
      if (!confirmed) return false;
    }
  },
  props: {
    forumId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      formIsDirty: false,
    };
  },
  computed: {
    forum() {
      return findById(this.$store.state.forums.items, this.forumId);
    },
  },

  async created() {
    await this.fetchForum({
      id: this.forumId,
    });
    this.asyncDataStatus_fetched();
  },

  methods: {
    ...mapActions('threads', ['createThread']),
    ...mapActions('forums', ['fetchForum']),
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

    <ThreadEditor
      @save="save"
      @cancel="cancel"
      @dirty="formIsDirty = true"
      @clean="formIsDirty = false"
    />
  </div>
</template>
