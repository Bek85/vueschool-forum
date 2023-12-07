<script>
import sourceData from '@/data.json';
import PostList from '@/components/PostList.vue';

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
};
</script>


<template>
  <div class="col-large push-top">
    <h2>{{ thread.title }}</h2>
    <PostList :posts="threadPosts" />
    <form>
      <div class="form-group">
        <textarea
          id=""
          :value="newPostText"
          class="form-input"
          name=""
          cols="30"
          rows="10"
          @input="newPostText = $event.target.value"
        ></textarea>
      </div>
      <div class="form-actions">
        <button class="btn-blue">Submit post</button>
      </div>
    </form>
  </div>
</template>
