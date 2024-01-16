import { makeFetchItemAction, makeFetchItemsAction } from '@/helpers';
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

    fetchCategory: makeFetchItemAction({ resource: 'categories', emoji: '📠' }),

    fetchCategories: makeFetchItemsAction({
      resource: 'categories',
      emoji: ';🐛',
    }),
  },
  mutations: {},
};
