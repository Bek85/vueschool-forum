import firebase from '@/helpers/firebase';

export default {
  namespaced: true,
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
              commit(
                'setItem',
                { resource: 'categories', item },
                { root: true }
              );
              return item;
            });

            resolve(categories);
          });
      }),

    fetchCategory: ({ dispatch }, { id }) =>
      dispatch(
        'fetchItem',
        { resource: 'categories', id, emoji: '📠' },
        { root: true }
      ),

    fetchCategories: ({ dispatch }, { ids }) =>
      dispatch(
        'fetchItems',
        { resource: 'categories', ids, emoji: ';🐛' },
        { root: true }
      ),
  },
  mutations: {},
};
