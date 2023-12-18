import { createStore } from 'vuex';
import sourceData from '@/data.json';
import { findById, randomHex, upsert } from '@/helpers/index';

export default createStore({
  state: {
    ...sourceData,
    authId: 'ALXhxjwgY9PinwNGHpfai6OWyDu2',
  },
  actions: {
    createPost({ commit, state }, post) {
      post.id = randomHex(10);
      post.userId = state.authId;
      post.publishedAt = Math.floor(Date.now() / 1000);
      commit('setPost', { post });
      commit('appendPostToThread', {
        postId: post.id,
        threadId: post.threadId,
      });
    },

    async createThread({ commit, state, dispatch }, { text, title, forumId }) {
      const id = randomHex(10);
      const userId = state.authId;
      const publishedAt = Math.floor(Date.now() / 1000);

      const thread = {
        forumId,
        title,
        publishedAt,
        userId,
        id,
      };

      commit('setThread', { thread });
      commit('appendThreadToForum', { forumId, threadId: id });
      commit('appendThreadToUser', { userId, threadId: id });
      dispatch('createPost', { text, threadId: id });

      return findById(state.threads, id);
    },

    async updateThread({ commit, state }, { title, text, id }) {
      const thread = findById(state.threads, id);

      const post = findById(state.posts, thread.posts[0]).text;

      const newThread = {
        ...thread,
        title,
      };

      const newPost = {
        ...post,
        text,
      };

      commit('setThread', {
        thread: newThread,
      });
      commit('setPost', {
        post: newPost,
      });

      return newThread;
    },

    updateUser(context, user) {
      context.commit('setUser', { user, userId: user.id });
    },
  },
  mutations: {
    setPost(state, { post }) {
      upsert(state.posts, post);
    },

    setThread(state, { thread }) {
      upsert(state.threads, thread);
    },

    setUser(state, { user, userId }) {
      const userIndex = state.users.findIndex((user) => user.id === userId);
      state.users[userIndex] = user;
    },

    appendPostToThread(state, { postId, threadId }) {
      const thread = findById(state.threads, threadId);

      thread.posts = thread.posts || [];
      thread.posts.push(postId);
    },

    appendThreadToForum(state, { forumId, threadId }) {
      const forum = findById(state.forums, forumId);

      forum.threads = forum.threads || [];
      forum.threads.push(threadId);
    },

    appendThreadToUser(state, { userId, threadId }) {
      const user = findById(state.users, userId);

      user.threads = user.threads || [];
      user.threads.push(threadId);
    },
  },
  getters: {
    authUser: (state) => {
      const user = findById(state.users, state.authId);

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
