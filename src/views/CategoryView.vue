<script>
import { mapActions } from 'vuex';
import { findById } from '@/helpers';
import asyncDataStatus from '@/mixins/asyncDataStatus';

export default {
  name: 'CategoryView',
  mixins: [asyncDataStatus],
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    category() {
      return findById(this.$store.state.categories.items, this.id) || {};

      // return this.$store.state.categories.find(
      //   (category) => category.id === this.id
      // );
    },
  },
  async created() {
    const category = await this.fetchCategory({
      id: this.id,
    });

    await this.fetchForums({
      ids: category.forums,
    });
    this.asyncDataStatus_fetched();
  },
  methods: {
    ...mapActions('categories', ['fetchCategory']),
    ...mapActions('forums', ['fetchForums']),

    getForumsForCategory(category) {
      return this.$store.state.forums.items.filter(
        (forum) => forum.categoryId === category.id
      );
    },
  },
};
</script>

<template>
  <div v-if="asyncDataStatus_ready" class="container col-full">
    <h1>{{ category.name }}</h1>
    <ForumList
      :title="category.name"
      :forums="getForumsForCategory(category)"
    />
  </div>
</template>
