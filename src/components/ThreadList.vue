<script>
import { findById } from '@/helpers';
export default {
  name: 'ThreadList',

  props: {
    threads: {
      type: Array,
      required: true,
    },
  },

  computed: {
    posts() {
      return this.$store.state.posts.items;
    },
    users() {
      return this.$store.state.users.items;
    },
  },
  methods: {
    postById(postId) {
      return findById(this.posts, postId);
    },
    userById(userId) {
      return findById(this.users, userId) || {};
    },
  },
};
</script>

<template>
  <div class="col-full">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>

      <div v-for="thread in threads" :key="thread.id" class="thread">
        <div>
          <p>
            <RouterLink :to="{ name: 'thread', params: { id: thread.id } }">{{
              thread.title
            }}</RouterLink>
          </p>
          <p class="text-faded text-xsmall">
            By <a href="#">{{ userById(thread.userId).name }}</a
            >, <AppDate :timestamp="thread.publishedAt" />.
          </p>
        </div>

        <div class="activity">
          <p class="replies-count">
            {{ thread.repliesCount }}
            {{
              thread.repliesCount > 1 || thread.repliesCount === 0
                ? 'replies'
                : 'reply'
            }}
          </p>

          <AppAvatarImg
            class="avatar-medium"
            :src="userById(thread.userId).avatar"
            alt=""
          />

          <div>
            <p class="text-xsmall">
              <a href="#">{{ userById(thread.userId).name }}</a>
            </p>
            <p class="text-xsmall text-faded">
              <AppDate :timestamp="thread.publishedAt" />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
