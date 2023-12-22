import firebase from 'firebase';
import { findById, randomHex } from '@/helpers';

export default {
  fetchAllCategories({ commit }) {
    console.log('🔥', '📠', 'categories');

    return new Promise((resolve) => {
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
    });
  },

  fetchCategory({ dispatch }, { id }) {
    return dispatch('fetchItem', { resource: 'categories', id, emoji: '📠' });
  },

  fetchThread({ dispatch }, { id }) {
    return dispatch('fetchItem', { resource: 'threads', id, emoji: '📄' });
  },

  fetchThreads({ dispatch }, { ids }) {
    return dispatch('fetchItems', { resource: 'threads', ids, emoji: '📄' });
  },

  fetchForum({ dispatch }, { id }) {
    return dispatch('fetchItem', { resource: 'forums', id, emoji: '📕' });
  },

  fetchForums({ dispatch }, { ids }) {
    return dispatch('fetchItems', { resource: 'forums', ids, emoji: '📕' });
  },

  fetchUser({ dispatch }, { id }) {
    return dispatch('fetchItem', { resource: 'users', id, emoji: '🙋‍♂️' });
  },

  fetchUsers({ dispatch }, { ids }) {
    return dispatch('fetchItems', { resource: 'users', ids, emoji: '🙋‍♂️' });
  },

  fetchPost({ dispatch }, { id }) {
    return dispatch('fetchItem', { resource: 'posts', id, emoji: '💭' });
  },

  fetchPosts({ dispatch }, { ids }) {
    return dispatch('fetchItems', { resource: 'posts', ids, emoji: '💭' });
  },

  createPost({ commit, state }, post) {
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
    commit('appendThreadToUser', { parentId: userId, childId: id });
    commit('appendThreadToForum', { parentId: forumId, childId: id });

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

  fetchItem({ state, commit }, { id, emoji, resource }) {
    console.log('🔥', emoji, `${resource}-id: ${id}`);
    // fetch the item
    return new Promise((resolve) => {
      firebase
        .firestore()
        .collection(resource)
        .doc(id)
        .onSnapshot((doc) => {
          const item = { ...doc.data(), id: doc.id };
          commit('setItem', { resource, id, item });
          resolve(item);
        });
    });
  },

  fetchItems({ dispatch }, { ids, resource, emoji }) {
    console.log('🔥', emoji, `${resource}-ids: ${ids}`);
    return Promise.all(
      ids.map((id) => dispatch('fetchItem', { id, resource, emoji }))
    );
  },
};
