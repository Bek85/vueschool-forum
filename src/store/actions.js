import firebase from '@/helpers/firebase';

export default {
  fetchItem: ({ commit }, { id, emoji, resource, handleUnsubscribe = null }) =>
    new Promise((resolve) => {
      console.log('🔥', emoji, `${resource}-id: ${id}`);
      const unsubscribe = firebase
        .firestore()
        .collection(resource)
        .doc(id)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const item = { ...doc.data(), id: doc.id };
            commit('setItem', { resource, id, item });

            resolve(item);
          } else {
            resolve(null);
          }
        });

      if (handleUnsubscribe) {
        handleUnsubscribe(unsubscribe);
      } else {
        commit('appendUnsubscribe', { unsubscribe });
      }
    }),

  fetchItems: ({ dispatch }, { ids, resource, emoji }) =>
    Promise.all(
      ids.map((id) => dispatch('fetchItem', { id, resource, emoji }))
    ),

  unsubscribeAllSnapshots: async ({ state, commit }) => {
    state.unsubscribes.forEach((unsubscribe) => unsubscribe());
    commit('clearAllUnsubscribes');
  },
};
