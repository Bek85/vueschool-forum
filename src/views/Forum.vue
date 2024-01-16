<script>
import { mapActions, mapGetters } from 'vuex';
import { findById } from '@/helpers';
import asyncDataStatus from '@/mixins/asyncDataStatus';

export default {
  name: 'ForumView',
  mixins: [asyncDataStatus],
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      page: parseInt(this.$route.query.page) || 1,
      perPage: 2,
    };
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    forum() {
      return findById(this.$store.state.forums.items, this.id);
      // return this.$store.state.forums.find((forum) => forum.id === this.id);
    },
    threads() {
      if (!this.forum) return [];
      return this.$store.state.threads.items
        .filter((thread) => thread.forumId === this.forum.id)
        .map((thread) => this.$store.getters['threads/thread'](thread.id));
    },
    threadCount() {
      return this.forum.threads.length;
    },
    totalPages() {
      if (!this.threadCount) return 0;
      return Math.ceil(this.threadCount / this.perPage);
    },
  },

  watch: {
    async page(page) {
      this.$router.push({ query: { page: this.page } });
    },
  },
  async created() {
    const forum = await this.fetchForum({ id: this.id });

    const threads = await this.fetchThreadsByPage({
      ids: forum.threads,
      page: this.page,
      perPage: this.perPage,
    });

    await this.fetchUsers({
      ids: threads.map((thread) => thread.userId),
    });
    this.asyncDataStatus_fetched();
  },

  methods: {
    ...mapActions('forums', ['fetchForum']),
    ...mapActions('threads', ['fetchThreadsByPage']),
    ...mapActions('users', ['fetchUsers']),
  },
};
</script>

<template>
  <div v-if="asyncDataStatus_ready" class="col-full">
    <div v-if="forum" class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{ forum.name }}</h1>
          <p class="text-lead">{{ forum.description }}</p>
        </div>
        <RouterLink
          v-if="authUser"
          :to="{ name: 'threadCreate', params: { forumId: forum.id } }"
          class="btn-green btn-small"
          >Start a thread</RouterLink
        >
      </div>
    </div>

    <div class="col-full push-top">
      <ThreadList :threads="threads" />
      <VPagination
        v-model="page"
        :pages="totalPages"
        active-color="#57AD8D"
        @update:model-value="page"
      />
    </div>
  </div>
</template>
