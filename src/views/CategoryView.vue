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

const category = computed(() => {
  return store.state.categories.find((category) => category.id === id);
});

const getForumsForCategory = (category) => {
  return store.state.forums.filter((forum) => forum.categoryId === category.id);
};
</script>

<template>
  <h1>{{ category.name }}</h1>
  <ForumList :title="category.name" :forums="getForumsForCategory(category)" />
</template>
