<script>
import sourceData from '@/data.json';
import PostList from '@/components/PostList.vue';
import randomHex from '@/helpers/randomHex';

export default {
  name: 'ThreadView',
  components: { PostList },
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
      newPostText: '',
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
    addNewPost() {
      const postId = randomHex(10);
      const post = {
        id: postId,
        text: this.newPostText,
        publishedAt: Math.floor(Date.now() / 1000),
        threadId: this.id,
        // generate random user id using crypto api
        userId: randomHex(11),
      };
      this.posts.push(post);
      this.thread.posts.push(postId);
      this.newPostText = '';
    },
  },
};
</script>


<template>
  <div class="col-large push-top">
    <h2>{{ thread.title }}</h2>
    <PostList :posts="threadPosts" />
    <form @submit.prevent="addNewPost">
      <div class="form-group">
        <textarea
          id=""
          v-model="newPostText"
          class="form-input"
          name=""
          cols="30"
          rows="10"
        ></textarea>
      </div>
      <div class="form-actions">
        <button class="btn-blue">Submit post</button>
      </div>
    </form>
  </div>
</template>
