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

const forum = computed(() => store.state.forums.find((f) => f.id === id));
const threads = computed(() =>
  store.state.threads.filter((t) => t.forumId === id)
);
</script>


<template>
  <div class="col-full push-top">
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
