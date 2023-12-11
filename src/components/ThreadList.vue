<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const { threads } = defineProps({
  threads: {
    type: Array,
    required: true,
  },
});

const store = useStore();

const users = computed(() => store.state.users);
// const posts = computed(() => store.state.posts);

const userById = (userId) => {
  return users.value.find((u) => u.id === userId);
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
