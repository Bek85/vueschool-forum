import firebase from '@/helpers/firebase';

export default {
  state: {
    items: [],
  },
  getters: {},
  actions: {
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

    fetchCategories: ({ dispatch }, { ids }) =>
      dispatch('fetchItems', { resource: 'categories', ids, emoji: ';🐛' }),
  },
  mutations: {},
};
