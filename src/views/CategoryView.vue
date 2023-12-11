<template>
  <h1>{{ category.name }}</h1>
  <ForumList :title="category.name" :forums="getForumsForCategory(category)" />
</template>

<script>
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
      return this.$store.state.categories.find(
        (category) => category.id === this.id
      );
    },
  },
  methods: {
    getForumsForCategory(category) {
      return this.$store.state.forums.filter(
        (forum) => forum.categoryId === category.id
      );
    },
  },
};
</script>
