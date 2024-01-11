<script>
export default {
  props: {
    categories: {
      required: true,
      type: Array,
    },
  },
  methods: {
    getForumsForCategory(category) {
      return this.$store.state.forums.items.filter(
        (forum) => forum.categoryId === category.id
      );
    },
  },
};
</script>

<template>
  <ForumList
    v-for="category in categories"
    :key="category.id"
    :forums="getForumsForCategory(category)"
    :title="category.name"
    :category-id="category.id"
  />
</template>
