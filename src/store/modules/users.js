import firebase from '@/helpers/firebase';
import { findById, makeAppendChildToParentMutation } from '@/helpers';

export default {
  state: {
    items: [],
  },
  getters: {
    user: (state) => {
      return (id) => {
        const user = findById(state.items, id);

        if (!user) return null;

        return {
          ...user,
          get posts() {
            return state.posts.filter((post) => post.userId === user.id);
          },
          get threads() {
            return state.items.filter((thread) => thread.userId === user.id);
          },
          get postsCount() {
            return user.postsCount || 0;
          },

          get threadsCount() {
            return user.threads?.length || 0;
          },
        };
      };
    },
  },
  actions: {
    createUser: async (
      { commit },
      { id, email, name, username, avatar = null }
    ) => {
      const registeredAt = firebase.firestore.FieldValue.serverTimestamp();
      const usernameLower = username.toLowerCase();
      email = email.toLowerCase();
      const user = {
        avatar,
        email,
        name,
        username,
        usernameLower,
        registeredAt,
      };

      const userRef = await firebase.firestore().collection('users').doc(id);

      userRef.set(user);
      const newUser = await userRef.get();
      commit('setItem', { resource: 'users', item: newUser });

      return docToResource(newUser);
    },

    updateUser: async (context, user) => {
      const updates = {
        avatar: user.avatar || null,
        username: user.username || null,
        name: user.name || null,
        bio: user.bio || null,
        website: user.website || null,
        email: user.email || null,
        location: user.location || null,
      };

      const userRef = firebase.firestore().collection('users').doc(user.id);

      await userRef.update(updates);

      context.commit('setItem', { resource: 'users', item: user });
    },

    fetchUser: ({ dispatch }, { id }) =>
      dispatch('fetchItem', { resource: 'users', id, emoji: '🙋‍♂️' }),

    fetchUsers: ({ dispatch }, { ids }) =>
      dispatch('fetchItems', { resource: 'users', ids, emoji: '🙋‍♂️' }),
  },
  mutations: {
    appendThreadToUser: makeAppendChildToParentMutation({
      parent: 'users',
      child: 'threads',
    }),
  },
};
