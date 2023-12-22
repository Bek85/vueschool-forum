import firebase from 'firebase';
import { findById, randomHex } from '@/helpers';

export default {
  fetchAllCategories: ({ commit }) =>
    new Promise((resolve) => {
      console.log('🔥', '📠', 'categories');
      firebase
        .firestore()
        .collection('categories')
        .onSnapshot((querySnapshot) => {
          const categories = querySnapshot.docs.map((doc) => {
            const item = { ...doc.data(), id: doc.id };
            commit('setItem', { resource: 'categories', item });
            return item;
          });
          resolve(categories);
        });
    }),

  fetchCategory: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'categories', id, emoji: '📠' }),

  fetchThread: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'threads', id, emoji: '📄' }),

  fetchThreads: ({ dispatch }, { ids }) =>
    dispatch('fetchItems', { resource: 'threads', ids, emoji: '📄' }),

  fetchForum: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'forums', id, emoji: '📕' }),

  fetchForums: ({ dispatch }, { ids }) =>
    dispatch('fetchItems', { resource: 'forums', ids, emoji: '📕' }),

  fetchUser: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'users', id, emoji: '🙋‍♂️' }),

  fetchUsers: ({ dispatch }, { ids }) =>
    dispatch('fetchItems', { resource: 'users', ids, emoji: '🙋‍♂️' }),

  fetchPost: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'posts', id, emoji: '💭' }),

  fetchPosts: ({ dispatch }, { ids }) =>
    dispatch('fetchItems', { resource: 'posts', ids, emoji: '💭' }),

  createPost: ({ commit, state }, post) => {
    post.id = randomHex(10);
    post.userId = state.authId;
    post.publishedAt = Math.floor(Date.now() / 1000);
    commit('setPost', { post });
    commit('appendPostToThread', {
      childId: post.id,
      parentId: post.threadId,
    });
    commit('appendContributorToThread', {
      childId: state.authId,
      parentId: post.threadId,
    });
  },

  createThread: async (
    { commit, state, dispatch },
    { text, title, forumId }
  ) => {
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
    commit('appendThreadToUser', { parentId: userId, childId: id });
    commit('appendThreadToForum', { parentId: forumId, childId: id });

    dispatch('createPost', { text, threadId: id });

    return findById(state.threads, id);
  },

  updateThread: async ({ commit, state }, { title, text, id }) => {
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

  updateUser: (context, user) =>
    context.commit('setUser', { user, userId: user.id }),

  fetchItem: ({ state, commit }, { id, emoji, resource }) =>
    new Promise((resolve) => {
      console.log('🔥', emoji, `${resource}-id: ${id}`);
      firebase
        .firestore()
        .collection(resource)
        .doc(id)
        .onSnapshot((doc) => {
          const item = { ...doc.data(), id: doc.id };
          commit('setItem', { resource, id, item });
          resolve(item);
        });
    }),

  fetchItems: ({ dispatch }, { ids, resource, emoji }) =>
    Promise.all(
      ids.map((id) => dispatch('fetchItem', { id, resource, emoji }))
    ),
};
