import { createStore } from 'vuex';
import sourceData from '@/data.json';
import randomHex from '@/helpers/randomHex';

export default createStore({
  state: {
    ...sourceData,
    authId: 'ALXhxjwgY9PinwNGHpfai6OWyDu2',
  },
  actions: {
    createPost(context, post) {
      post.id = randomHex(10);
      context.commit('setPost', { post });
      context.commit('appendPostToThread', {
        postId: post.id,
        threadId: post.threadId,
      });
    },
    updateUser(context, user) {
      context.commit('setUser', { user, userId: user.id });
    },
  },
  mutations: {
    setPost(state, { post }) {
      state.posts.push(post);
    },
    setUser(state, { user, userId }) {
      const userIndex = state.users.findIndex((user) => user.id === userId);
      state.users[userIndex] = user;
    },

    appendPostToThread(state, { postId, threadId }) {
      const thread = state.threads.find((thread) => thread.id === threadId);
      thread.posts.push(postId);
    },
  },
  getters: {
    authUser: (state) => {
      const user = state.users.find((user) => user.id === state.authId);
      if (!user) return null;

      return {
        ...user,
        get posts() {
          return state.posts.filter((post) => post.userId === user.id);
        },
        get threads() {
          return state.threads.filter((thread) => thread.userId === user.id);
        },
        get postsCount() {
          return this.posts.length;
        },

        get threadsCount() {
          return this.threads.length;
        },
      };
    },
  },
});
