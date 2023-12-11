<template>
  <h1>{{ category.name }}</h1>
  <ForumList :title="category.name" :forums="getForumsForCategory(category)" />
</template>

<script>
import sourceData from '@/data.json';
export default {
  name: 'CategoryView',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    category() {
      return sourceData.categories.find((category) => category.id === this.id);
    },
  },
  methods: {
    getForumsForCategory(category) {
      return sourceData.forums.filter(
        (forum) => forum.categoryId === category.id
      );
    },
  },
};
</script>
