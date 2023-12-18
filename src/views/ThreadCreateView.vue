<script>
export default {
  props: {
    forumId: {
      type: String,
      required: true,
    },
  },
  computed: {
    forum() {
      return this.$store.state.forums.find(
        (forum) => forum.id === this.forumId
      );
    },
  },
  methods: {
    // dispatch vue action
    async save({ title, text }) {
      const thread = await this.$store.dispatch('createThread', {
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
  <div class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <ThreadEditor :forum-id="forum.id" @save="save" @cancel="cancel" />
  </div>
</template>
