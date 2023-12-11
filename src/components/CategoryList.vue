<template>
  <ForumList
    v-for="category in categories"
    :key="category.id"
    :forums="getForumsForCategory(category)"
    :category-name="category.name"
  />
</template>

<script>
import sourceData from '@/data.json';

export default {
  props: {
    categories: {
      required: true,
      type: Array,
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
