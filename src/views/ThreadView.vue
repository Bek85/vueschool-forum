<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const { id } = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const store = useStore();

const threads = computed(() => {
  return store.state.threads;
});

const posts = computed(() => {
  return store.state.posts;
});

const thread = computed(() => {
  return threads.value.find((t) => t.id === id);
});

const threadPosts = computed(() => {
  return posts.value.filter((post) => post.threadId === id);
});

const addNewPost = (eventData) => {
  const post = {
    ...eventData.post,
    threadId: id,
  };
  store.dispatch('createPost', post);
};
</script>


<template>
  <div class="col-large push-top">
    <div class="heading">
      <h1>
        {{ thread.title }}
      </h1>
      <RouterLink
        :to="{ name: 'threadEdit', id: id }"
        class="btn-green btn-small"
        >Edit Thread</RouterLink
      >
    </div>
    <PostList :posts="threadPosts" />
    <PostEditor @save="addNewPost" />
  </div>
</template>

<style scoped>
.heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
