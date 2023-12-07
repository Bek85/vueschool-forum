<script>
import sourceData from '@/data.json';
import PostList from '@/components/PostList.vue';
import PostEditor from '@/components/PostEditor.vue';

export default {
  name: 'ThreadView',
  components: { PostList, PostEditor },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      threads: sourceData.threads,
      posts: sourceData.posts,
    };
  },
  computed: {
    thread() {
      return this.threads.find((t) => t.id === this.id);
    },
    threadPosts() {
      return this.posts.filter((post) => post.threadId === this.id);
    },
  },
  methods: {
    addNewPost(eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id,
      };
      this.posts.push(post);
      this.thread.posts.push(post.id);
    },
  },
};
</script>


<template>
  <div class="col-large push-top">
    <h2>{{ thread.title }}</h2>
    <PostList :posts="threadPosts" />
    <PostEditor @save="addNewPost" />
  </div>
</template>
