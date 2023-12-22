<script>
import { mapActions } from 'vuex';
import { findById } from '@/helpers';

export default {
  name: 'ForumView',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    forum() {
      return findById(this.$store.state.forums, this.id);
      // return this.$store.state.forums.find((forum) => forum.id === this.id);
    },
    threads() {
      if (!this.forum) return [];
      return this.forum.threads.map((threadId) =>
        this.$store.getters.thread(threadId)
      );
      // return this.$store.state.threads;
      // return this.$store.state.threads.filter(
      //   (thread) => thread.forumId === this.id
      // );
    },
  },
  async created() {
    const forum = await this.fetchForum({ id: this.id });

    const threads = await this.fetchThreads({
      ids: forum.threads,
    });

    this.fetchUsers({
      ids: threads.map((thread) => thread.userId),
    });
  },

  methods: {
    ...mapActions(['fetchForum', 'fetchThreads', 'fetchUsers']),
  },
};
</script>


<template>
  <div v-if="forum" class="col-full push-top">
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <RouterLink
        :to="{ name: 'threadCreate', params: { forumId: forum.id } }"
        class="btn-green btn-small"
        >Start a thread</RouterLink
      >
    </div>
  </div>

  <div class="col-full push-top">
    <ThreadList :threads="threads" />
  </div>
</template>
