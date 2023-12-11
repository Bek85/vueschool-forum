<script>
export default {
  name: 'ForumList',
  props: {
    forums: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: 'Forums',
    },
    categoryId: {
      type: String,
      required: false,
    },
  },
  methods: {
    forumThreadsWord(forum) {
      if (forum.threads?.length) {
        return forum.threads.length > 1 ? 'threads' : 'thread';
      } else {
        return 'no threads';
      }
    },
  },
};
</script>


<template>
  <div class="col-full">
    <div class="forum-list">
      <h2 class="list-title">
        <RouterLink
          v-if="categoryId"
          :to="{ name: 'category', params: { id: categoryId } }"
          >{{ title }}</RouterLink
        >
        <span v-else>{{ title }}</span>
      </h2>

      <div v-for="forum in forums" :key="forum.id" class="forum-listing">
        <div class="forum-details">
          <RouterLink
            :to="{ name: 'forum', params: { id: forum.id } }"
            class="text-xlarge"
            >{{ forum.name }}</RouterLink
          >
          <p>{{ forum.description }}.</p>
        </div>

        <div class="threads-count">
          <p>
            <span class="count">{{ forum.threads?.length }}</span>
            {{ forumThreadsWord(forum) }}
          </p>
        </div>

        <div class="last-thread"></div>
      </div>
    </div>
  </div>
</template>
