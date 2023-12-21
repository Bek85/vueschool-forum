import { createStore } from 'vuex';
import firebase from 'firebase';
// import sourceData from '@/data.json';
import { findById, randomHex, upsert } from '@/helpers';

export default createStore({
  state: {
    // ...sourceData,
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: 'ALXhxjwgY9PinwNGHpfai6OWyDu2',
  },
  actions: {
    fetchAllCategories({ commit }) {
      console.log('🔥', '🏷', 'all');

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

    fetchThread({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'threads', id, emoji: '📄' });
    },

    fetchThreads({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'threads', ids, emoji: '📄' });
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

    fetchPost({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'posts', ids, emoji: '💭' });
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
      console.log('🔥', emoji, id);
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
      console.log('🔥', emoji, ids);
      return Promise.all(
        ids.map((id) => dispatch('fetchItem', { id, resource, emoji }))
      );
    },
  },
  mutations: {
    setItem(state, { resource, item }) {
      upsert(state[resource], item);
    },

    setPost(state, { post }) {
      upsert(state.posts, post);
    },

    setThread(state, { thread }) {
      upsert(state.threads, thread);
    },

    setUser(state, { user }) {
      upsert(state.users, user);
    },

    appendPostToThread: makeAppendChildToParentMutation({
      parent: 'threads',
      child: 'posts',
    }),

    appendThreadToForum: makeAppendChildToParentMutation({
      parent: 'forums',
      child: 'threads',
    }),

    appendThreadToUser: makeAppendChildToParentMutation({
      parent: 'users',
      child: 'threads',
    }),
    appendContributorToThread: makeAppendChildToParentMutation({
      parent: 'threads',
      child: 'contributors',
    }),
  },

  getters: {
    authUser: (state, getters) => {
      return getters.user(state.authId);
    },

    user: (state) => {
      return (id) => {
        const user = findById(state.users, id);

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
      };
    },

    thread: (state) => {
      return (id) => {
        const thread = findById(state.threads, id);
        return {
          ...thread,
          get author() {
            return findById(state.users, thread.userId);
          },
          get repliesCount() {
            return thread.posts.length - 1;
          },
          get contributorsCount() {
            return thread.contributors.length;
          },
        };
      };
    },
  },
});

function makeAppendChildToParentMutation({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId);
    resource[child] = resource[child] || [];
    if (!resource[child].includes(childId)) resource[child].push(childId);
  };
}
