<script setup>
import sourceData from '@/data.json';
import { reactive } from 'vue';

const state = reactive({
  posts: sourceData.posts,
  users: sourceData.users,
});

const { users } = state;

const { threads } = defineProps({
  threads: {
    type: Array,
    required: true,
  },
});

// const postById = (postId) => {
//   return posts.find((p) => p.id === postId);
// };

const userById = (userId) => {
  return users.find((u) => u.id === userId);
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
          <p class="replies-count">{{ thread.posts.length }} replies</p>

          <img
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
