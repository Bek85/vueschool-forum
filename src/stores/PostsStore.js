import { defineStore } from 'pinia';
import sourceData from '@/data.json';
import randomHex from '@/helpers/randomHex';
import { useThreadsStore } from './ThreadsStore';

export const usePostsStore = defineStore('posts', {
  state: () => {
    return { posts: sourceData.posts };
  },
  getters: {},
  actions: {
    createPost(post) {
      post.id = randomHex(10);
      this.posts.push(post);
      const { threads } = useThreadsStore();

      const thread = threads.find((thread) => thread.id === post.threadId);

      thread.posts.push(post.id);
    },
  },
});
