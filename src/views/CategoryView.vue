<script>
import { mapActions } from 'vuex';
import { findById } from '@/helpers';

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
      return findById(this.$store.state.categories, this.id) || {};

      // return this.$store.state.categories.find(
      //   (category) => category.id === this.id
      // );
    },
  },
  async created() {
    const category = await this.fetchCategory({
      id: this.id,
    });

    this.fetchForums({
      ids: category.forums,
    });
  },
  methods: {
    ...mapActions(['fetchCategory', 'fetchForums']),

    getForumsForCategory(category) {
      return this.$store.state.forums.filter(
        (forum) => forum.categoryId === category.id
      );
    },
  },
};
</script>

<template>
  <h1>{{ category.name }}</h1>
  <ForumList :title="category.name" :forums="getForumsForCategory(category)" />
</template>
