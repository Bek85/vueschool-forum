import { createStore } from 'vuex';
import sourceData from '@/data.json';
import randomHex from '@/helpers/randomHex';

export default createStore({
  state: sourceData,
  actions: {
    createPost(context, post) {
      post.id = randomHex(10);
      context.commit('setPost', { post });
      context.commit('appendPostToThread', {
        postId: post.id,
        threadId: post.threadId,
      });
    },
  },
  mutations: {
    setPost(state, { post }) {
      state.posts.push(post);
    },
    appendPostToThread(state, { postId, threadId }) {
      const thread = state.threads.find((thread) => thread.id === threadId);
      thread.posts.push(postId);
    },
  },
});
